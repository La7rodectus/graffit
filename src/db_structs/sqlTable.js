const { wrapString } = require('../utils/helpers.js');
// const DatabaseDataValidator = require('../dataValidators/dataValidator.js');
const SelectQueryBuilder = require('./queryBuilders/selectQueryBuilder.js');
const InsertQueryBuilder = require('./queryBuilders/insertQueryBuider.js');
//TODO: rewrite usage of PK type String to []String

class SqlTable {
  constructor(connProvider, tableData, constraints, dataValidator) {
    this.connProvider = connProvider;
    this.name = tableData.name;
    this.fields = tableData.fields;
    this.PK = tableData.PK;  //[name String, name String ...]
    this.FK = tableData.FK;  //[name String, name String ...]
    this.alias = this.name.slice(0, 1);
    this.constraints = constraints;
    this.validator = dataValidator.validate.bind(null, this.name);
    this.validate = (field, value) => {
      if (!this.validator(field, value)) {
        throw new Error(`Value *${value}* is not valid for field ${field}`);
      }
    };
  }

  createQueryBuilder(firstQuery, queryBuilderType) {
    if (queryBuilderType === 'select') return new SelectQueryBuilder(firstQuery, this.connProvider, this);
    else if (queryBuilderType === 'insert') return new InsertQueryBuilder(firstQuery, this.connProvider, this);
  }

  get(...fields) {
    if (fields.length === 0) fields = [`*`];
    const query = { select: `SELECT ${fields.join(', ')}`,
      from: `FROM ${this.name} ${this.alias}` };
    return this.createQueryBuilder(query, 'select');
  }

  //deleteByPK(pk) {}

  //updateByPK(pk, object) {}

  insert(...objects) {
    const insertNames = Object.keys(objects[0]);
    let insertValues = [];
    for (const object of objects) {
      if (JSON.stringify(Object.keys(object)) !== JSON.stringify(insertNames)) {
        throw new Error('Fields in objects, passed to insert method should be equal!');
      }
      const insertValuesList = Object.values(object);
      for (let i = 0; i < insertNames.length; i++) {
        this.validate(insertNames[i], insertValuesList[i]);
        insertValuesList[i] = wrapString(insertValuesList[i]);
      }
      insertValues.push(`(${insertValuesList.join(',')})`);
    }
    insertValues = insertValues.join(',');
    const query = { insert: `INSERT INTO ${this.name}(${insertNames.join(',')}) VALUES ${insertValues}` };
    return this.createQueryBuilder(query, 'insert');
  }

}

module.exports = SqlTable;
