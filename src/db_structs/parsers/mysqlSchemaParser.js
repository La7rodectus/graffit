const BaseSchemaParser = require('./baseSchemaParser.js');

class MySqlSchemaParser extends BaseSchemaParser {
  constructor() {
    super();
  }

  _getBaseTableNames(conn) {
    const q = `SELECT table_name FROM information_schema.tables WHERE table_type = 'BASE TABLE'`;
    return this._exec(q, conn);
  }

  _descTable(conn, name) {
    const q = `DESC ${name}`;
    return this._exec(q, conn);
  }

  _getConstraintsPerTable(conn, tableName) {
    const q = `SELECT COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_COLUMN_NAME, REFERENCED_TABLE_NAME
               FROM information_schema.KEY_COLUMN_USAGE
               WHERE TABLE_NAME = '${tableName}'`;
    return this._exec(q, conn);
  }

}

module.exports = MySqlSchemaParser;
