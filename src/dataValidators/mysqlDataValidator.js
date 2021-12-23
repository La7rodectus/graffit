const DatabaseDataValidator = require('./dataValidator.js');

class MysqlDataValidator extends DatabaseDataValidator {
  constructor(schema) {
    super(schema);
  }



}

module.exports = MysqlDataValidator;
