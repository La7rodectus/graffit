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
    let query = `WHERE ${field} `;
    return { 
      equals: (value) => {
        query += `= ${value}`;
        queryBuilder.editSchema(expressionName, query);
        return queryBuilder;
      },
    }
  }

  orderBy(field, order = 'ASC') {
    const expressionName = 'orderBy';
    if (order !== 'ASC' && order !== 'DESC') throw new Error('Parameter order should be "ASC" or "DESC"!');
    if (!this.#table.fields.hasOwnProperty(field)) throw new Error(`Field ${field} does not exist in table ${this.#table.name}`);
    this.editSchema(expressionName, `ORDER BY ${field} ${order}`);
    return this;
  }

  innerJoin(tableName, joinBy) {
    const expressionName = 'innerJoin';
    const query = `INNER JOIN ${tableName} AS tN ON `

  }
}

module.exports = { QueryBuilder }
