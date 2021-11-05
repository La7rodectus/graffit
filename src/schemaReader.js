const Procedures = require('./db_types/procedures.js');

module.exports.default = class SchemaReader {
  constructor() {}

  static async queryDbSchema() {
    try {
      const schema = {
        name: null,
        tables: {},
      };
      const data = await Procedures.getBaseTableNames(this._conn);
      const tableNames = [];
      for (const row of data) tableNames.push(row['table_name']);
      const promises = [];
      for (const tName of tableNames) {
        promises.push(Procedures.descTable(this._conn, tName));
      }
      Promise.all(promises).then((data) => {
        if (data.length === 0) throw new Error('Empty Tables!');
        for (let i = 0; i < tableNames.length; i++) {
          const tableFields = data[i];
          schema.tables[tableNames[i]] = {};
          for (const fieldRow of tableFields) {
            schema.tables[tableNames[i]][fieldRow.Field] = fieldRow.Type;
          }
        }
        return({ schema, err: null });
      });
    } catch (err) {
      return({ schema: null, err });
    }
  }

};


