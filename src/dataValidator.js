const TYPES_MODEL = {
  int: 'number',
  varchar: 'string',
  char: 'string',

};


module.exports.default = class DatabaseDataValidator {
  constructor(schema) {
    this.validationSchema = this._parseSchema(schema);
  }

  _parseSchema(inputSchema) {
    const schema = JSON.parse(JSON.stringify(inputSchema));
    const tables = schema.tables;
    for (const tableName in tables) {
      const table = tables[tableName];
      const tableValidator = {};
      const tableFields = table.fields;
      for (const field in tableFields) {
        let type = tableFields[field];
        type = type.substr(0, type.length - 1).split('(');
        tableValidator[field] = this._createValidationFunc(type);
      }
      schema.tables[tableName] = tableValidator;
    }
    return schema;
  }

  _createValidationFunc(type) {
    const jsType = TYPES_MODEL[type[0]];
    const maxLen = +type[1];
    return (val) => {
      console.log('val:', val)
      console.log('valLen:', Number.valueOf(val).length)
      if (typeof val !== jsType) return false;
      if (jsType === 'string' && val.length > maxLen) return false;
      if (jsType === 'number' && Number.valueOf(val).length > maxLen) return false;
      return true;
    };
  }

  validate = (tableName, field, val) => this.validationSchema.tables[tableName][field](val);

}
