const DBC = require('./dbc.js');
const { SUPPORTED_DRIVERS } = require('./config.js');
const { GraffitError } = require('./errors.js');

class Graffit {
  constructor() {}

  static createController(connObj, options) {
    const defaultOptions = {
      driver: 'mysql',
    };
    options = options || defaultOptions;
    if (!SUPPORTED_DRIVERS.includes(options.driver)) {
      throw new GraffitError('This driver is not supported!');
    }
    return new DBC(connObj, options);
  }

}

module.exports = Graffit;
