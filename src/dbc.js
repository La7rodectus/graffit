const Procedures = require('./procedures.js');
const ConnectionsController = require('./connectionsController.js').default;
const DatabaseDataValidator = require('./dataValidator.js').default;

const defaultOptions = {
  dbdv: DatabaseDataValidator,
};

//data base controller
module.exports.default = class DBC {
  constructor(conn_obj, options = {}) {
    this._conn = null;
    this.options = { ...defaultOptions, ...options };
    this.dbdv = options.dbdv;                            // DatabaseDataValidator
    this.cc = new ConnectionsController(conn_obj);       // ConnectionController
    this.schema = null;
  }

  connect = (cb) => new Promise((resolve, reject) => {
    this.cc.getConnection().then((res) => {
      if (res.err) return resolve(res.err);
      this._conn = res.conn;
      if (cb) cb();
      resolve();
    });
  });

  connDestroy() {
    this._conn.destroy();
    this._conn = null;
  }

  init = (dbSchema) => new Promise(async (resolve, reject) => {
    try {
      if (!this._conn) {
        const err = await this.connect();
        if (err) throw err;
      }
      const schema = dbSchema ? dbSchema : await this.queryDbSchema();
      this.schema = schema;
      this.dbdv = new this.options.dbdv(this.schema);
      resolve();
    } catch (err) {
      reject(err);
    }
  });

  queryDbSchema = () => new Promise(async (resolve, reject) => {
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
        resolve(schema);
      });
    } catch (err) {
      reject(err);
    }
  });

  insertBank = (updateObj) => Procedures.insertIntoTable(this._conn, 'Banks', updateObj);

  updateBankByName = (name, updateObj) => Procedures.updateTable(this._conn, 'Banks', 'bankName', name, updateObj);

  deleteFromBankByName = (name) => Procedures.deleteRowsFromTable(this._conn, 'Banks', 'bankName', name);

  getAllBanks = () => Procedures.getAllFromTable(this._conn, 'Banks');

  getBankByName = (name) => Procedures.getFromTableBy(this._conn, 'Banks', 'bankName', name);

}
