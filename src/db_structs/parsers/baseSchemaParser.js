
const Schema = require('../schemas/schema.js');

class BaseSchemaParser {
  constructor() {}

  _exec(q, conn) {
    return new Promise((resolve, reject) => {
      conn.query(q, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  }

  async queryDbSchema(conn) {
    try {
      const schema = new Schema();
      const data = await this._getBaseTableNames(conn);
      const tableNames = [];
      for (const row of data) tableNames.push(row['table_name']);
      const promises = [];
      for (const tName of tableNames) {
        promises.push(this._descTable(conn, tName));
      }
      return await Promise.all(promises).then((data) => {
        if (data.length === 0) throw new Error('Empty Tables!');
        for (let i = 0; i < tableNames.length; i++) {
          const tableFields = data[i];
          schema.tables[tableNames[i]] = {
            fields: {},
            FK: [],
            PK: undefined,
          };
          for (const fieldRow of tableFields) {
            const isNull = fieldRow.Null === 'YES' ? null : '';
            schema.tables[tableNames[i]].fields[fieldRow.Field] = fieldRow.Type + `|${isNull}`;
            if (fieldRow.Key === 'PRI') schema.tables[tableNames[i]].PK = fieldRow.Field;
            else if (fieldRow.Key === 'MUL') schema.tables[tableNames[i]].FK.push(fieldRow.Field);
          }
          const tableData = schema.tables[tableNames[i]];
          tableData.name = tableNames[i];
          schema.addTable(tableData);
        }
        return schema;
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async queryConstraints(conn, schema) {
    try {
      const constraints = {};
      Object.keys(schema.tables).forEach(tableName => constraints[tableName] = {});
      for (const tableName of Object.keys(schema.tables)) {
        const data = await this._getConstraintsPerTable(conn, tableName);
        for (const packet of data) {
          if (packet.CONSTRAINT_NAME !== 'PRIMARY') {
            const refTableName = packet.REFERENCED_TABLE_NAME;
            const refColumnName = packet.REFERENCED_COLUMN_NAME;
            const columnName = packet.COLUMN_NAME;
            const constraintName = packet.CONSTRAINT_NAME;
            if (!constraints[tableName].hasOwnProperty(refTableName)) constraints[tableName][refTableName] = {};
            if (!constraints[refTableName].hasOwnProperty(tableName)) constraints[refTableName][tableName] = {};
            constraints[tableName][refTableName][constraintName] = [columnName, refColumnName]; 
            constraints[refTableName][tableName][constraintName] = [refColumnName, columnName]; 
          }
        }
      }
      // console.dir(constraints, {depth: 4});
      return constraints;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

}

module.exports = BaseSchemaParser;
