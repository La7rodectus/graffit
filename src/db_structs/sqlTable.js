const { wrapString, wrapObjectFields, replaceAt } = require('../../helpers.js');
// const DatabaseDataValidator = require('../dataValidators/dataValidator.js');
const QueryBuilder = require('./queryBuilder.js');

//TODO: rewrite usage of PK type String to []String

class SqlTable {
  constructor(connProvider, tableData) {
    this.connProvider = connProvider;
    this.name = tableData.name;
    this.fields = tableData.fields;
    this.PK = tableData.PK;  //[name String, name String ...]
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
    return this.createQueryBuilder(query).do();
  }

  select(...fields) {
    if (!Array.isArray(fields) || fields.length === 0) fields = ['*'];
    const query = `SELECT ${fields.join(', ')} FROM ${this.name}`;
    return this.createQueryBuilder(query);
  }

  deleteByPK(pk) {
    const wrappedPk = wrapString(pk);
    const query = `DELETE FROM ${this.name} 
                   WHERE ${this.PK} = ${wrappedPk};`;
    return this.executeQuery(query);
  }

  updateByPK(pk, object) {
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
    return this.executeQuery(query);
  }

  insert(object) {
    const wrappedObject = wrapObjectFields(object);
    const values = Object.values(wrappedObject).join(', ');
    const fields = Object.keys(wrappedObject).join(', ');
    ///
    console.log(fields, '\n', values);
    ///
    const query = `INSERT INTO ${this.name} ( ${fields} )
                   VALUES ( ${values} );`;
    return this.executeQuery(query);
  }

  async orderBy(field) {

  }

}

module.exports = SqlTable;
