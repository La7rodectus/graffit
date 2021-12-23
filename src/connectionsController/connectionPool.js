const ConnectionService = require('./connectionService.js');
const EventEmitter = require('events');

const defaultOptions = {
  maxConn: 5,

};

class ConnectionPool {
  #availableConn = new Map();
  #busyConn = new Map();

  #constructorSetup() {
    this.ee.addListener('release', this.#moveConnToAvailable.bind(this));
    this.ee.addListener('connDestroyed', this.#removeConnFromPool.bind(this));

    // this.finalizer = new FinalizationRegistry((heldVal) => this.destroy.bind(heldVal));
    // this.finalizer.register(this, { registeredConnections: this.registeredConnections });

    process.on('exit', this.destroy.bind(this));
    process.on('SIGINT', this.destroy.bind(this));
  }

  constructor(connObj, driverName, options) {
    this.options = { ...defaultOptions, ...options };
    this.connObj = connObj;
    this.totalConn = 0;
    this.ee = new EventEmitter();
    this.cs = new ConnectionService(connObj, driverName);

    this.#constructorSetup();
  }

  #removeConnFromPool(conn) {
    this.#availableConn.delete(conn.threadId);
    this.#busyConn.delete(conn.threadId);
    this.#updateConnCounter();
  }

  destroy() {
    console.log('destroy ConnectionPool called');
    for (const conn of this.#availableConn.values()) {
      this.#removeConnFromPool(conn);
      conn.destroy();
    }
    for (const conn of this.#busyConn.values()) {
      conn.destroy();
      this.#removeConnFromPool(conn);
    }
  }

  #updateConnCounter() {
    this.totalConn = this.#availableConn.size + this.#busyConn.size;
  }

  #getReadyConn() {
    return this.#availableConn.values()[0];
  }

  async getConnection() {
    let conn = this.#getReadyConn();
    if (!conn && this.totalConn < this.options.maxConn) {
      conn = await this.cs.create();
    }
    this.#moveConnToBusy(conn);
    conn = ConnectionService.wrap(conn, this.ee);
    this.#updateConnCounter();
    return conn;
  }

  #moveConnToAvailable(conn) {
    this.#busyConn.delete(conn.threadId);
    this.#availableConn.set(conn.threadId, conn);
    this.updateConnCounter();
  }

  #moveConnToBusy(conn) {
    this.#busyConn.set(conn.threadId, conn);
    delete this.#availableConn.delete(conn.threadId);
    this.updateConnCounter();
  }

}

module.exports = ConnectionPool;
