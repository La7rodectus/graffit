const UniqueStringsGenerator = require('../../utils/uniqueStringsGenerator');
const BaseQueryBuilder = require('./baseQueryBuilder');
const schema = require('../schemas/insertSchema.js');

class SelectQueryBuilder extends BaseQueryBuilder {
  #connProvider;
  #table;
  #schema;
  #alias;
  #aliases;
  #stringsGenerator;
  #constraints;
  #nestTables;
  #validate;
  constructor(firstQuery, connProvider, table) {
    super();
    this.queryType = 'insert';
    this.#schema = schema();
    for (const queryType in firstQuery) {
      this.editSchema(queryType, firstQuery[queryType]);
    }
    this.#connProvider = connProvider;
    this.#table = table;
    this.#alias = this.#table.alias;
    const main = this.#alias;
    this.#aliases = { main };
    this.#stringsGenerator = new UniqueStringsGenerator(this.#aliases);
    this.#constraints = this.#table.constraints;
    this.#nestTables = false;
    this.#validate = (field, value) => {
      if (!this.#table.validate(field, value)) {
        throw new Error(`Value *${value}* is not valid for field ${field}`);
      }
    };
  }

  findIndexBySchemaField(field) {
    for (let i = 0; i < this.#schema.length; i++) {
      if (this.#schema[i].hasOwnProperty([field])) return i;
    }
    return null;
  }

  async do() {
    const result = await super.do(this.#nestTables, this.#connProvider, this.#schema);
    return result;
  }

  editSchema(expressionName, query) {
    this.#schema[this.findIndexBySchemaField(expressionName)][expressionName] += query;
  }
}

module.exports = SelectQueryBuilder;
