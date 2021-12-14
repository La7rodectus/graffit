const UniqueStringsGenerator = require('../util/UniqueStringsGenerator').UniqueStringsGenerator;
const SelectSchema = require('./schemas/selectShema.js').SelectSchema;
const schemas = {
  'select': SelectSchema,
}

class QueryBuilder {
  #connProvider;
  #table;
  #schema;
  #alias;
  #aliases;
  #stringsGenerator;
  #constraints;
  #nestTables;
  constructor(firstQuery, connProvider, table) {
    for (let queryType in firstQuery) {
      if (schemas.hasOwnProperty(queryType)) this.#schema = schemas[queryType]();
      const startQueryIndex = this.findIndexBySchemaField(queryType);
      this.#schema[startQueryIndex][queryType] = firstQuery[queryType];
    }
    this.#connProvider = connProvider;
    this.#table = table;
    this.#alias = this.#table.alias;
    this.#aliases = {};
    this.#stringsGenerator = new UniqueStringsGenerator(this.#aliases);
    this.#constraints = this.#table.constraints;
    this.#nestTables = false;
  }

  findIndexBySchemaField(field) {
    for (let i = 0; i < this.#schema.length; i++) {
      if (this.#schema[i].hasOwnProperty(field)) return i;
    }
    return null;
  } 

  async do() {
    const query = this.getFullQuery();
    const nestTables = this.#nestTables ? '_' : false;
    const {conn, err} = await this.#connProvider.getConnection();
    if (err) return {conn, err};
    return new Promise((resolve, reject) => {
      conn.query({sql: query, nestTables }, (err, result) => {
        conn.release();
        if (err) reject(err);
        else resolve(result);
      });      
    });
  }

  getFullQuery() {
    let fullQuery = '';
    for (let expressionName of this.#schema) {
      const expressionValue = Object.values(expressionName)[0];
      if (expressionValue.length > 0) fullQuery += ' ';
      fullQuery += Object.values(expressionName)[0];
    }
    fullQuery += ';';
    console.log('full query', fullQuery);
    return fullQuery;
  }

  editSchema(expressionName, query) {
    this.#schema[this.findIndexBySchemaField(expressionName)][expressionName] += query;
  }

  where(field) {
    const expressionName = 'where';
    if (!this.#table.fields.hasOwnProperty(field)) throw new Error(`Field ${field} does not exist in table ${this.#table.name}`);
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
        if (typeof value !== 'number') throw new Error(`Value ${value} should be of type number`);
        let eq = '';
        if (equalsBool) eq += '=';
        query += `${queryBuilder.#alias}.${cmpField} <${eq} ${value}`;
        return this;
      },
      more(value, cmpField = field, equalsBool = false) {
        if (typeof value !== 'number') throw new Error(`Value ${value} should be of type number`);
        let eq = '';
        if (equalsBool) eq += '=';
        query += `${queryBuilder.#alias}.${cmpField} >${eq} ${value}`;
        return this;
      },
      between(value1, value2, cmpField = field) {
        if (typeof value1 !== 'number') throw new Error(`Value ${value1} should be of type number`);
        if (typeof value2 !== 'number') throw new Error(`Value ${value2} should be of type number`);
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
    }
    return whereSelectors;
  }

  orderBy(field, order = 'ASC') {
    const expressionName = 'orderBy';
    if (order !== 'ASC' && order !== 'DESC') throw new Error('Parameter order should be "ASC" or "DESC"');
    if (!this.#table.fields.hasOwnProperty(field)) throw new Error(`Field ${field} does not exist in table ${this.#table.name}`);
    this.editSchema(expressionName, `ORDER BY ${this.#alias}.${field} ${order}`);
    return this;
  }

  join(table, key1 = null, key2 = null) {
    const tableName = table.name;
    let fkeys = [];
    let pkey = null;
    if (key1 === null && key2 === null) {
      const cstrs = this.#constraints[this.#table.name][tableName];
      for (const name in cstrs) {
        const [ fk ] = cstrs[name];
        fkeys.push(fk);
        pkey = cstrs[name][1];
      }
    } else {
      if (this.#table.PK === key1) {
        fkeys = [key2];
        pkey = key1;
      } else {
        fkeys = [key1];
        pkey = key2;
      }
      
    }
    const expressionName = 'innerJoin';
    let query = '';
    for (let key of fkeys) {
      query += this.innerJoinQuery(tableName, key, pkey);
    }
    this.editSchema(expressionName, query);
    this.#nestTables = true;
    //this.appendToSelect(tableName);
    return this;
  }

  innerJoinQuery(tableName, key1, key2) {
    if (!this.#aliases.hasOwnProperty(tableName + '_' +  key1)) this.#stringsGenerator.generateUniqueString(tableName, key1);
    const alias = this.#aliases[tableName + '_' +  key1];
    return `INNER JOIN ${tableName} ${alias} ON ${alias}.${key2} = ${this.#alias}.${key1} `;
  }
}

module.exports = QueryBuilder;
