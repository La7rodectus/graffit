const { wrapString, wrapObjectFields } = require('../../helpers.js');
const TableInstance = require('./tableInstance.interface.js').default;

class SqlTable extends TableInstance {
  constructor(connProvider, tableData) {
    super();
    this.connProvider = connProvider;
    this.name = tableData.name;
    this.fields = tableData.fields;
    this.PK = tableData.PK;  // name String
    this.FK = tableData.FK;  //[name String, name String ...]
  }

  //check after
  async executeQuery(query) {
    const {conn, err} = await this.connProvider.getConnection();
    if (err) return {conn, err};
    return new Promise((resolve, reject) => {
      conn.query(query, (err, script) => {
        if (err) reject(err);
        else resolve(script);
      });
    });
  }

  async getByPK(pk) {
    const wrappedPk = wrapString(pk);
    const query = `SELECT * 
                   FROM ${this.name} 
                   WHERE ${this.PK} = ${wrappedPk};`;
    return await this.executeQuery(query);
  }

  async getAll() {
    const query = `SELECT * FROM ${this.name}`;
    return await this.executeQuery(query);
  }

  async deleteByPK(pk) {
    const wrappedPk = wrapString(pk);
    const query = `DELETE FROM ${this.name} 
                   WHERE ${this.PK} = ${wrappedPk};`;
    return await this.executeQuery(query);
  }

  async updateByPK(pk, object) {
    const wrappedPk = wrapString(pk);
    const wrappedObject = wrapObjectFields(object);
    let setRow = '';
    for (const field in wrappedObject) {
      setRow += `${field} = ${wrappedObject[field]},\n`;
    }
    const lastComaId = setRow.lastIndexOf(',');
    setRow = replaceAt(setRow, lastComaId, ' ');
    const query = `UPDATE ${this.name}
                   SET ${setRow}
                   WHERE ${this.PK} = ${wrappedPk};`;
    return await this.executeQuery(query);
  }

  async insertByPK(object) {
    const wrappedObject = wrapObjectFields(object);
    const values = Object.values(wrappedObject).join(', ');
    const fields = Object.keys(wrappedObject).join(', ');
    ///
    console.log(fields, '\n', values);
    ///
    const query = `INSERT INTO ${this.name} ( ${fields} )
                   VALUES ( ${values} );`;
    return await this.executeQuery(query);
  }

};

module.exports = { SqlTable };
