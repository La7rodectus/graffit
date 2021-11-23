const ConnectionService = require('./connectionService.js');

const defaultOptions = {
  maxConn: 5,

};

class ConnectionPool {
  #availableConn = new Map();
  #busyConn = new Map();

  constructor(connObj, driverName, options) {
    this.options = { ...defaultOptions, ...options };
    this.connObj = connObj;
    this.cs = new ConnectionService(connObj, driverName);
  }

  destroy() {
    console.log('destroy ConnectionPool called');
  }

  getReadyConn() {
    const id = this.#availableConn.keys()[0];
    return this.#availableConn.get(id);
  }

  getConn() {
    const conn = this.getReadyConn();
    if (!conn) {
      
    }
  }

  moveConnToReady(conn) {
    this.#busyConn.delete(conn.threadId);
    this.#availableConn.set(conn.threadId, conn);
    this.updateConnCounter();
  }

  moveConnToRunning(conn) {
    this.runningConn[conn._id] = conn;
    delete this.readyConn[conn._id];
    this.updateConnCounter();
  }

}

module.exports.default = ConnectionPool;
