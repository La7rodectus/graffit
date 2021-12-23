const { DOCS_LINK } = require('./config');

class GraffitError extends Error {
  constructor(message) {
    super(message);
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
  }

}

class InvalidArgument extends GraffitError {
  constructor(arg) {
    super();
    this.message = `invalid argument (${arg})`;
  }

}

class InvalidArgumentType extends InvalidArgument {
  constructor(arg, expect = null) {
    super(arg);
    this.message += ` type: ${typeof arg}`;
    if (expect) this.message += `, expect: ${expect}`;
  }

}

class InvalidNumberOfArguments extends GraffitError {
  constructor(found, expect) {
    super();
    [found, expect].forEach((v) => {
      if (!Number.isInteger(v)) throw new InvalidArgumentType(v, 'int');
    });
    this.message += `invalid number of arguments, found: ${found}, expect: ${expect}`;
  }

}

class SyntaxError extends GraffitError {
  constructor() {
    super();
    this.message = `syntax error, please check docs: ${DOCS_LINK}`;
  }

}

class UnknownField extends GraffitError {
  constructor(field) {
    super();
    this.message = `can't validate unknown field: ${field}`;
  }

}



module.exports = {
  InvalidArgument,
  InvalidArgumentType,
  InvalidNumberOfArguments,
  SyntaxError,
  UnknownField,

};
