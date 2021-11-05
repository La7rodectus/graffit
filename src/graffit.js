const DBC = require('./dbc.js').default;

module.exports.default = class Graffit {
  constructor() {}

  static createController(connObj, options) {
    return new DBC(connObj, options);
  }

};
