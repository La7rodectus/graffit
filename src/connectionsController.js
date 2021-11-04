const mysql = require('mysql');

module.exports.default = class ConnectionController {
  constructor(conn_obj) {
    this.conn_obj = conn_obj;
  }

  getConnection = () => new Promise((resolve, reject) => {
    const conn = mysql.createConnection(this.conn_obj);
    conn.connect((err) => {
      if (err) return resolve({err, conn});
      resolve({err, conn});
    });
  });

}
