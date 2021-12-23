// const UniqueStringsGenerator = require('../../utils/uniqueStringsGenerator');

class BaseQueryBuilder {
  constructor() {}

  async do(nestedTables, connProvider, schema) {
    const fullQuery = this.getFullQuery(schema);
    const nestTables = nestedTables ? '_' : false;
    const { conn, err } = await connProvider.getConnection();
    if (err) return { conn, err };
    return new Promise((resolve, reject) => {
      conn.query({ sql: fullQuery, nestTables }, (err, result) => {
        conn.release();
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  getFullQuery(schema) {
    let fullQuery = '';
    for (const expressionName of schema) {
      const expressionValue = Object.values(expressionName)[0];
      if (expressionValue.length > 0) fullQuery += ' ';
      fullQuery += Object.values(expressionName)[0];
    }
    fullQuery += ';';
    console.log('full query', fullQuery);
    return fullQuery;
  }

}

module.exports = BaseQueryBuilder;
