const { wrapString, wrapObjectFields } = require('../../helpers.js');
const DatabaseDataValidator = require('../dataValidators/dataValidator.js');
const QueryBuilder = require('./queryBuilder.js');

//TODO: rewrite usage of PK type String to []String

class SqlTable {
  constructor(connProvider, tableData, constraints) {
    this.connProvider = connProvider;
    this.name = tableData.name;
    this.fields = tableData.fields;
    this.PK = tableData.PK;  //[name String, name String ...] 
    this.FK = tableData.FK;  //[name String, name String ...]
    this.alias = this.name.slice(0, 1);
    this.constraints = constraints;
  }

  //check after
  async executeQuery(query) {
    
  }

  createQueryBuilder(firstQuery) {
    return new QueryBuilder(firstQuery, this.connProvider, this);
  }

  async getByPK(pk) {
    const wrappedPk = wrapString(pk);
    const query = `SELECT ${this.name}.* 
                   FROM ${this.name} 
                   WHERE ${this.PK} = ${wrappedPk};`;
    return this.createQueryBuilder(query).do();
  }

  get(...fields) {
    if (!Array.isArray(fields) || fields.length === 0) fields = [`*`];
    const query = {select: `SELECT ${fields.join(', ')}`,
                    from: `FROM ${this.name} ${this.alias}`};
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

  async insert(object) {
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

module.exports = SqlTable;
