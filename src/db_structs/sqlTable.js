const { wrapString, wrapObjectFields } = require('../../helpers.js');
const TableInstance = require('./tableInstance.interface.js').default;
const QueryBuilder = require('./queryBuilder.js').QueryBuilder;

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
    
  }

  createQueryBuilder(firstQuery) {
    return new QueryBuilder(firstQuery, this.connProvider, this);
  }

  async getByPK(pk) {
    const wrappedPk = wrapString(pk);
    const query = `SELECT * 
                   FROM ${this.name} 
                   WHERE ${this.PK} = ${wrappedPk};`;
    return await this.executeQuery(query);
  }

  get(...fields) {
    if (!Array.isArray(fields) || fields.length === 0) fields = ['*'];
    const query = `SELECT ${fields.join(', ')} FROM ${this.name}`;
    return this.createQueryBuilder(query);
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

  async orderBy(field) {
    
  }

};

module.exports = { SqlTable };
