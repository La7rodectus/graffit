
const defaultOptions = {
  maxConn: 5,
};

class ConnectionPool {
  readyConn = new Map();
  runningConn = new Map();
  constructor(options) {
    this.options = { ...defaultOptions, ...options };

  }

  getNextConnId() {
    return this.nextConnId++;
  }
  
  destroy() {
    console.log('destroy ConnectionPool called');
    if (Object.keys(this.readyConn).length) {
      for (const conn of Object.values(this.readyConn)) {
        if (conn) conn.destroy();
      }
    }
    if (Object.keys(this.runningConn).length) {
      for (const conn of Object.values(this.runningConn)) {
        if (conn) conn.destroy();
      }
    }
  }
  getReadyConn() {
    const id = Object.keys(this.readyConn)[0];
    return this.readyConn[id];
  }

  moveConnToReady(conn) {
    delete this.runningConn[conn._id];
    this.readyConn[conn._id] = conn;
    this.updateConnCounter();
  }
  moveConnToRunning(conn) {
    this.runningConn[conn._id] = conn;
    delete this.readyConn[conn._id];
    this.updateConnCounter();
  }

}

module.exports.default = ConnectionPool;
