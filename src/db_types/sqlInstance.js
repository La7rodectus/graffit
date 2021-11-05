const { wrapStr } = require('../../helpers.js');

module.exports.default = class SqlInstance {
  constructor(tableData) {
    this.name = tableData.name;
    this.fields = tableData.fields;
    this.PK = tableData.PK;  //String
    this.FK = tableData.AK;  //[String, String]
  }

  async get(conn, pk) {
    const wrappedPk = wrapStr(pk);
    const q = `SELECT * FROM ${this.name} WHERE ${this.PK} = ${wrappedPk};`;
    return new Promise((resolve, reject) => {
      conn.query(q, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  }

  delete() {}

  update() {}

  insert() {}

};

