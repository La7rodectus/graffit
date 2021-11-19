const DBC = require('./dbc.js').default;

class Graffit {
  constructor() {}

  static createController(connObj, options) {
    return new DBC(connObj, options);
  }

};

module.exports.default = Graffit;
