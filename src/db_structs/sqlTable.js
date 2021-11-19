const { wrapStr, wrapUpdateObjFields } = require('../../helpers.js');
const Instance = require('./instance.intf.js').default;

class SqlTable extends Instance {
  constructor(connProvider, tableData) {
    super();
    this.connProvider = connProvider;
    this.name = tableData.name;
    this.fields = tableData.fields;
    this.PK = tableData.PK;  //String
    this.FK = tableData.FK;  //[String, String]
  }


  async get(pk) {
    const wrappedPk = wrapStr(pk);
    const q = `SELECT * FROM ${this.name} WHERE ${this.PK} = ${wrappedPk};`;
    const conn = await this.connProvider.getConnection();
    return new Promise((resolve, reject) => {
      conn.query(q, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  }

  async getAll() {
    const q = `SELECT * FROM ${this.name}`;
    const conn = await this.connProvider.getConnection();
    return new Promise((resolve, reject) => {
      conn.query(q, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  }

  async delete(pk) {
    const wrappedPk = wrapStr(pk);
    const q = `DELETE FROM ${this.name} WHERE ${this.PK} = ${wrappedPk};`;
    const conn = await this.connProvider.getConnection();
    return new Promise((resolve, reject) => {
      conn.query(q, (err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res);
      });
    });
  }

  async update(pk, updateObj) {
    const wrappedUpdateObj = wrapUpdateObjFields(updateObj);
    const wrappedPk = wrapStr(pk);
    let setRow = '';
    for (const field in wrappedUpdateObj) {
      setRow += `${field} = ${wrappedUpdateObj[field]},\n`;
    }
    const lastComaId = setRow.lastIndexOf(',');
    setRow = replaceAt(setRow, lastComaId, ' ');
    const q = `
      UPDATE ${this.name}
      SET
        ${setRow}
      WHERE
        ${this.PK} = ${wrappedPk};
    `;
    return new Promise((resolve, reject) => {
      conn.query(q, (err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res);
      });
    });
  }

  async insert(insertObj) {
    const wrappedInsertObj = wrapUpdateObjFields(insertObj);
    const values = Object.values(wrappedInsertObj).join(', ');
    const fields = Object.keys(wrappedInsertObj).join(', ');
    ///
    console.log(fields, '\n', values);
    ///
    const q = `
      INSERT INTO ${this.name} ( ${fields} )
      VALUES ( ${values} );
    `;
    return new Promise((resolve, reject) => {
      conn.query(q, (err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res);
      });
    });
  }

};

module.exports = { SqlTable };
