const SelectSchema = require('./schemas/selectShema.js').SelectSchema;
const schemas = {
  'select': SelectSchema,
}

class QueryBuilder {
  #connProvider;
  #table;
  #schema;
  constructor(firstQuery, connProvider, table) {
    const queryType = firstQuery.split(' ')[0].toLowerCase();
    this.#schema = schemas[queryType]();
    const startQueryIndex = this.findIndexBySchemaField(queryType);
    this.#schema[startQueryIndex][queryType] = firstQuery;
    this.#connProvider = connProvider;
    this.#table = table;
  }

  findIndexBySchemaField(field) {
    for (let i = 0; i < this.#schema.length; i++) {
      if (this.#schema[i].hasOwnProperty(field)) return i;
    }
    return null;
  } 

  async do() {
    const query = this.getFullQuery();
    const {conn, err} = await this.#connProvider.getConnection();
    if (err) return {conn, err};
    return new Promise((resolve, reject) => {
      conn.query(query, (err, result) => {
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
    this.#schema[this.findIndexBySchemaField(expressionName)][expressionName] = query;
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
        query += `${cmpField} IN (${vals.join(', ')})`;
        return this;
      },
      isNull(cmpField = field) {
        query += `${cmpField} IS NULL`;
        return this;
      },
      equals(value, cmpField = field) {
        query += `${cmpField} = ${value}`;
        return this;
      },
      like(likePattern, cmpField = field) {
        query += `${cmpField} LIKE ${likePattern}`;
        return this;
      },
      notEquals(value, cmpField = field) {
        query += `${cmpField} <> ${value}`;
        return this;
      },
      less(value, cmpField = field, equalsBool = false) {
        if (typeof value !== 'number') throw new Error(`Value ${value} should be of type number`);
        let eq = '';
        if (equalsBool) eq += '=';
        query += `${cmpField} <${eq} ${value}`;
        return this;
      },
      more(value, cmpField = field, equalsBool = false) {
        if (typeof value !== 'number') throw new Error(`Value ${value} should be of type number`);
        let eq = '';
        if (equalsBool) eq += '=';
        query += `${cmpField} >${eq} ${value}`;
        return this;
      },
      between(value1, value2, cmpField = field) {
        if (typeof value1 !== 'number') throw new Error(`Value ${value1} should be of type number`);
        if (typeof value2 !== 'number') throw new Error(`Value ${value2} should be of type number`);
        query += `${cmpField} BETWEEN ${value1} AND ${value2}`;
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
    this.editSchema(expressionName, `ORDER BY ${field} ${order}`);
    return this;
  }

  innerJoin(table, key1, key2) {
    const expressionName = 'innerJoin';
    const query = `INNER JOIN ${table.name} ON ${table.name}.${key2} = ${this.#table.name}.${key1}`;
    this.editSchema(expressionName, query);
    return this;
  }
}

module.exports = QueryBuilder;
