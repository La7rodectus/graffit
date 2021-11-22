const mysql = require('mysql');
const process = require('process');
const EventEmitter = require('events');
const Connection = require('./connection.js').default;
const ConnectionPool = require('./connectionPool.js').default;

const defaultOptions = {
  maxConn: 5,
};

class ConnectionController {
  registeredConnections = new Map();

  #constructorSetup() {
    this.ee.addListener('release', this.#destroyConn.bind(this));
    this.ee.addListener('connDestroyed', () => console.log('conn destroy event called'));
    // this.finalizer.register(this, { readyConn: this.readyConn, runningConn: this.runningConn });
    process.on('exit', this.destroy.bind(this));
    process.on('SIGINT', this.destroy.bind(this));
  }

  constructor(conn_obj, options) {
    this.conn_obj = conn_obj;
    this.totalConn = 0;
    this.nextConnId = 0;
    this.options = { ...defaultOptions, ...options };
    this.ee = new EventEmitter();
    // this.finalizer = new FinalizationRegistry((heldVal) => this.finalizerCb(heldVal));

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
    this.#unregisterConn(conn);
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
      const conn = Connection.wrap(await mysql.createConnection(this.conn_obj), this.ee);
      const cErr = await this.#connect(conn);
      if (cErr) return {conn: null, err: cErr};
      this.#registerConn(conn);
      return { conn, err: null };
    } catch (err) {
      return { conn: null, err };
    }
  }

  #connect = (conn) => new Promise((resolve) => {
    conn.connect((err) => {
      if (err) return resolve(err);
      resolve(err);
    });
  });

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

}

module.exports.default = ConnectionController;
