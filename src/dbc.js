const ConnectionsController = require('./connectionsController/connectionsController.js');
const SqlTable = require('./db_structs/sqlTable.js');

const defaultOptions = {
  driver: 'mysql',

};

//data base controller
class DBC {
  constructor(connObj, options) {
    this.options = { ...defaultOptions, ...options };
    this.parser = new (require(`./db_structs/parsers/${this.options.driver}SchemaParser.js`))();
    this.Dbdv = options.Dbdv || require(`./dataValidators/${this.options.driver}DataValidator.js`); // DatabaseDataValidator
    this.cc = new ConnectionsController(connObj); // ConnectionController
    this.schema = undefined;
    this.constraints = undefined;
  }

  #assignSchema(schema, constraints) {
    const tables = schema.getTables();
    for (const table of Object.values(tables)) {
      this[table.name] = new SqlTable(this, table, constraints, this.dbdv);
    }
  }

  async init(dbSchema) {
    try {
      const { conn, err } = await this.getConnection();
      if (err) throw err;
      this.schema = dbSchema ? dbSchema : await this.parser.queryDbSchema(conn);
      this.constraints = await this.parser.queryConstraints(conn, this.schema);
      conn.release();
      this.dbdv = new this.Dbdv(this.schema);
      this.#assignSchema(this.schema, this.constraints);
    } catch (err) {
      return err;
    }
  }

  getSchema() {
    return this.schema;
  }

  getConnection() {
    return this.cc.getConnection();
  }

}

module.exports = DBC;
