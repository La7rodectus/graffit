
class ConnectionService  {
  constructor(connObj, driverName) {
    this.connObj = connObj;
    this.driver = require(driverName);
  }

  async create() {
    return await this.driver.createConnection(this.connObj);
  }

  connect = (conn) => new Promise((resolve) => {
    conn.connect((err) => resolve(err));
  });

  static wrap(conn, ee) {
    conn.release = () => ee.emit('release', conn);
    const destroyF = conn.destroy.bind(conn);
    conn.destroy = (...args) => {
      ee.emit('connDestroyed', conn);
      destroyF(...args);
    };
    return conn;
  }

}

module.exports.default = ConnectionService;
