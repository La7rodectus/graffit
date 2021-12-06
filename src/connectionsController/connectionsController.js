const process = require('process');
const EventEmitter = require('events');
const ConnectionService = require('./connectionService.js');
const ConnectionPool = require('./connectionPool.js');

const defaultOptions = {
  maxConn: 5,
  driverName: 'mysql',

};

class ConnectionController {
  registeredConnections = new Map();

  #constructorSetup() {
    this.ee.addListener('release', this.#destroyConn.bind(this));
    this.ee.addListener('connDestroyed', this.#unregisterConn.bind(this));

    this.finalizer = new FinalizationRegistry((heldVal) => this.destroy.bind(heldVal));
    this.finalizer.register(this, { registeredConnections: this.registeredConnections });

    process.on('exit', this.destroy.bind(this));
    process.on('SIGINT', this.destroy.bind(this));
  }

  constructor(connObj, options) {
    this.connObj = connObj;
    this.totalConn = 0;
    this.options = { ...defaultOptions, ...options };
    this.ee = new EventEmitter();
    this.cs = new ConnectionService(connObj, this.options.driverName);

    this.#constructorSetup();
  }

  #updateConnCounter() {
    this.totalConn = this.registeredConnections.size;
  }

  #registerConn(conn) {
    this.registeredConnections.set(conn.threadId, conn);
    console.log('reg conn', conn.threadId)
    this.#updateConnCounter();
  }

  #unregisterConn(conn) {
    this.registeredConnections.delete(conn.threadId);
    console.log('unreg conn', conn.threadId)
    this.#updateConnCounter();
  }

  #destroyConn(conn) {
    console.log(`destroy connection called on threadId: ${conn.threadId}`);
    conn.destroy();
  }

  destroy() {
    console.log('destroy registered connections called on', this.registeredConnections.keys());
    for (const conn of this.registeredConnections.values()) {
      this.#destroyConn(conn);
    }
  }
  
  async createConn() {
    const connLimit = this.options.maxConn;
    if (this.totalConn >= connLimit) return { conn: null, err: `Conn limit is ${connLimit}` };
    try {
      const conn = ConnectionService.wrap(await this.cs.create(), this.ee);
      const cErr = await this.cs.connect(conn);
      if (cErr) return {conn: null, err: cErr};
      this.#registerConn(conn);
      return { conn, err: null };
    } catch (err) {
      return { conn: null, err };
    }
  } 

  async getConnection() {
    const res = Object.create({conn: null, err: null});
    const {conn, err} = await this.createConn();
    if (err) {
      res.err = err;
      return res;
    }
    res.conn = conn;
    return res;
  }

  async createPool(options) {
    const pool = new ConnectionPool(this.connObj, this.options.driverName, options);
    await pool.init();
    return pool;
  }

}

module.exports = ConnectionController;
