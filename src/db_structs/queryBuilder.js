const { InvalidArgumentType, UnknownField } = require('../errors');
const UniqueStringsGenerator = require('../utils/uniqueStringsGenerator');
const SelectSchema = require('./schemas/selectSchema.js');

const schemas = {
  'select': SelectSchema,
};

class QueryBuilder {
  #connProvider;
  #table;
  #schema;
  #alias;
  #aliases;
  #stringsGenerator;

  constructor(firstQuery, connProvider, table) {
    for (const queryType in firstQuery) {
      if (schemas[queryType]) this.#schema = schemas[queryType]();
      const startQueryIndex = this.findIndexBySchemaField(queryType);
      this.#schema[startQueryIndex][queryType] = firstQuery[queryType];
    }
    this.#connProvider = connProvider;
    this.#table = table;
    this.#alias = this.#table.alias;
    this.#aliases = {};
    this.#stringsGenerator = new UniqueStringsGenerator(this.#aliases);
  }

  findIndexBySchemaField(field) {
    for (let i = 0; i < this.#schema.length; i++) {
      if (this.#schema[i][field]) return i;
    }
    return null;
  }

  async do() {
    const query = this.getFullQuery();
    const { conn, err } = await this.#connProvider.getConnection();
    if (err) return { conn, err };
    return new Promise((resolve, reject) => {
      conn.query({ sql: query, nestTables: '_' }, (err, result) => {
        conn.release();
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  getFullQuery() {
    let fullQuery = '';
    for (const expressionName of this.#schema) {
      const expressionValue = Object.values(expressionName)[0];
      if (expressionValue.length > 0) fullQuery += ' ';
      fullQuery += Object.values(expressionName)[0];
    }
    fullQuery += ';';
    console.log('full query', fullQuery);
    return fullQuery;
  }

  editSchema(expressionName, query) {
    this.#schema[this.findIndexBySchemaField(expressionName)][expressionName] = query;
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
        query += `${queryBuilder.#alias}.${cmpField} = ${value}`;
        return this;
      },
      like(likePattern, cmpField = field) {
        query += `${queryBuilder.#alias}.${cmpField} LIKE ${likePattern}`;
        return this;
      },
      notEquals(value, cmpField = field) {
        query += `${queryBuilder.#alias}.${cmpField} <> ${value}`;
        return this;
      },
      less(value, cmpField = field, equalsBool = false) {
        if (typeof value !== 'number') throw new InvalidArgumentType(value, 'number');
        let eq = '';
        if (equalsBool) eq += '=';
        query += `${queryBuilder.#alias}.${cmpField} <${eq} ${value}`;
        return this;
      },
      more(value, cmpField = field, equalsBool = false) {
        if (typeof value !== 'number') thrownew InvalidArgumentType(value, 'number');
        let eq = '';
        if (equalsBool) eq += '=';
        query += `${queryBuilder.#alias}.${cmpField} >${eq} ${value}`;
        return this;
      },
      between(value1, value2, cmpField = field) {
        if (typeof value1 !== 'number') throw new InvalidArgumentType(value, 'number');
        if (typeof value2 !== 'number') throw new InvalidArgumentType(value, 'number');
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
    if (!this.#table.fields[field]) throw new UnknownField(field);
    this.editSchema(expressionName, `ORDER BY ${this.#alias}.${field} ${order}`);
    return this;
  }

  join(table, key1 = null, key2 = null) {
    const tableName = table.name;
    let keys1 = null;
    if (key1 === null && key2 === null) {
      keys1 = this.#table.FK;
      key2 = table.PK;
    } else {
      keys1 = [key1];
    }
    console.log(keys1, key2); // here
    const expressionName = 'innerJoin';
    let query = '';
    for (const key of keys1) {
      query += this.innerJoinQuery(tableName, key, key2);
    }
    this.editSchema(expressionName, query);
    //this.appendToSelect(tableName);
    return this;
  }

  innerJoinQuery(tableName, key1, key2) {
    if (!this.#aliases[tableName + key1]) this.#stringsGenerator.generateUniqueString(tableName, key1);
    const alias = this.#aliases[tableName + key1];
    return `INNER JOIN ${tableName} ${alias} ON ${alias}.${key2} = ${this.#alias}.${key1} `;
  }
}

module.exports = QueryBuilder;
