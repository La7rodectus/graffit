const UniqueStringsGenerator = require('../../utils/uniqueStringsGenerator');
const { wrapString } = require('../../utils/helpers.js');
const BaseQueryBuilder = require('./baseQueryBuilder');
const schema = require('../schemas/selectSchema.js');
const { InvalidArgumentType } = require('../../errors.js');


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
    this.queryType = 'select';
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
      if (!this.#table.validator(field, value)) {
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

  where(field) {
    const expressionName = 'where';
    if (!this.#table.fields[field]) {
      throw new ReferenceError(`Field ${field} does not exist in table ${this.#table.name}`);
    }
    const queryBuilder = this;
    let query = `WHERE `;
    const whereSelectors = {
      and() {
        query += ` AND `;
        return this;
      },
      or() {
        query += ` OR `;
        return this;
      },
      existsIn(vals, cmpField = field) {
        query += `${queryBuilder.#alias}.${cmpField} IN (${vals.join(', ')})`;
        return this;
      },
      isNull(cmpField = field) {
        query += `${queryBuilder.#alias}.${cmpField} IS NULL`;
        return this;
      },
      equals(value, cmpField = field) {
        queryBuilder.#validate(cmpField, value);
        value = wrapString(value);
        query += `${queryBuilder.#alias}.${cmpField} = ${value}`;
        return this;
      },
      like(likePattern, cmpField = field) {
        query += `${queryBuilder.#alias}.${cmpField} LIKE ${likePattern}`;
        return this;
      },
      notEquals(value, cmpField = field) {
        queryBuilder.#validate(cmpField, value);
        query += `${queryBuilder.#alias}.${cmpField} <> ${value}`;
        return this;
      },
      less(value, cmpField = field, equalsBool = false) {
        queryBuilder.#validate(cmpField, value);
        if (typeof value !== 'number') throw new InvalidArgumentType(value, 'number');
        let eq = '';
        if (equalsBool) eq += '=';
        query += `${queryBuilder.#alias}.${cmpField} <${eq} ${value}`;
        return this;
      },
      more(value, cmpField = field, equalsBool = false) {
        queryBuilder.#validate(cmpField, value);
        if (typeof value !== 'number') throw new InvalidArgumentType(value, 'number');
        let eq = '';
        if (equalsBool) eq += '=';
        query += `${queryBuilder.#alias}.${cmpField} >${eq} ${value}`;
        return this;
      },
      between(value1, value2, cmpField = field) {
        queryBuilder.#validate(cmpField, value1);
        queryBuilder.#validate(cmpField, value2);
        query += `${queryBuilder.#alias}.${cmpField} BETWEEN ${value1} AND ${value2}`;
        return this;
      },
      startExpression() {
        query += `(`;
        return this;
      },
      endExpression() {
        query += `)`;
        return this;
      },
      endWhere() {
        queryBuilder.editSchema(expressionName, query);
        return queryBuilder;
      },
    };
    return whereSelectors;
  }

  orderBy(field, order = 'ASC') {
    const expressionName = 'orderBy';
    if (order !== 'ASC' && order !== 'DESC') throw new InvalidArgumentType(order, 'ASC|DESC');
    if (!this.#table.fields.hasOwnProperty(field)) {
      throw new Error(`Field ${field} does not exist in table ${this.#table.name}`);
    }
    this.editSchema(expressionName, `ORDER BY ${this.#alias}.${field} ${order}`);
    return this;
  }

  join(table, key1 = null, key2 = null) {
    const tableName = table.name;
    let fkeys = [];
    let pkey = null;
    if (!key1 && !key2) {
      const cstrs = this.#constraints[this.#table.name][tableName];
      for (const name in cstrs) {
        const [ fk ] = cstrs[name];
        fkeys.push(fk);
        pkey = cstrs[name][1];
      }
    } else if (this.#table.PK === key1) {
      fkeys = [key2];
      pkey = key1;
    } else {
      fkeys = [key1];
      pkey = key2;
    }
    const expressionName = 'innerJoin';
    let query = '';
    for (const key of fkeys) {
      query += this.innerJoinQuery(tableName, key, pkey);
    }
    this.editSchema(expressionName, query);
    this.#nestTables = true;
    return this;
  }

  innerJoinQuery(tableName, key1, key2) {
    if (!this.#aliases.hasOwnProperty(tableName + '_' +  key1)) this.#stringsGenerator.generateUniqueString(tableName, key1);
    const alias = this.#aliases[tableName + '_' +  key1];
    return `INNER JOIN ${tableName} ${alias} ON ${alias}.${key2} = ${this.#alias}.${key1} `;
  }
}

module.exports = SelectQueryBuilder;
