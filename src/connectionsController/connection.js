

class Connection  {
  constructor() {}

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

module.exports.default = Connection;
