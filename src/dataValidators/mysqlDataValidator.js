const DatabaseDataValidator = require('./dataValidator.js');

class MysqlDataValidator extends DatabaseDataValidator {
  constructor(schema) {
    this.validationSchema = this._parseSchema(schema);
  }

 

}

module.exports = MysqlDataValidator;
