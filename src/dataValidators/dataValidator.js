const { UnknownField } = require('../errors.js');
const validators = require('./baseValidators.js');

const DEFAULT_VALIDATORS_CREATORS = {
  int: [validators.createIntBaseValidator],
  varchar: [validators.createStringBaseValidator],
  char: [validators.createStringBaseValidator],
  date: [validators.createDateBaseValidator],
  time: [validators.createTimeBaseValidator],
  datetime: [validators.createDateTimeBaseValidator],

};

class DatabaseDataValidator {
  constructor(schema) {
    this.validationSchema = this.#parseSchema(schema);
  }

  validate = (tableName, field, val) => this.#callValidators(tableName, field, val);

  addValidator(table, field, ...validators) {
    this.validationSchema.tables[table][field].contact(validators);
  }

  #callValidators(tableName, field, val) {
    const validators = this.validationSchema.tables[tableName][field];
    if (!validators) throw new UnknownField(field);
    for (const validator of validators) {
      if (!validator(val)) return false;
    }
    return true;
  }

  #parseSchema(inputSchema) {
    const schema = JSON.parse(JSON.stringify(inputSchema));
    const tables = schema.tables;
    for (const tableName in tables) {
      const table = tables[tableName];
      const tableValidator = {};
      const tableFields = table.fields;
      for (const field in tableFields) {
        const rowType = tableFields[field];
        tableValidator[field] = this.#createValidationFunc(rowType);
      }
      schema.tables[tableName] = tableValidator;
    }
    return schema;
  }

  #createValidationFunc(rowType) {
    const typeRegEx = /^[a-zA-Z]+/g;
    const [type] = rowType.match(typeRegEx);
    const creators = DEFAULT_VALIDATORS_CREATORS[type];
    if (!creators) {
      console.warn('Unsupported data type:', type);
      return [];
    }
    return creators.map((creator) => creator(rowType));
  }

}

module.exports = DatabaseDataValidator;
