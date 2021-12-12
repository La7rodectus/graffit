const { Range } = require('../utils.js');
const { isNullNum, isNullStr } = require('./helpers.js');

const MYSQL_CONFIG = {
  date: {
    from: new Date('1000-01-01'),
    to: new Date('9999-12-31'),
    format: 'YYYY-MM-DD',
  }
}

function parseTypeString(str) {
  return str.split('|');
}

function createIntBaseValidator(typeString) {
  const [sqlType, isNull] = parseTypeString(typeString);
  let [type, len] = sqlType.slice(0, -1).split('(');
  len = +len;
  return (val = null) => {
    if (isNullNum(val)) return isNull ? true : false;

    if (!Number.isInteger(val)) return false;
    if (Math.abs(val).toString().length > len) return false;
    return true;
  }
}

function createStringBaseValidator(typeString) {
  const [sqlType, isNull] = parseTypeString(typeString);
  let [type, len] = sqlType.slice(0, -1).split('(');
  len = +len;
  return (val = null) => {
    if (isNullStr(val)) return isNull ? true : false;

    if (!(typeof val === 'string') && !(val instanceof String)) return false;
    if (val.length > len) return false;
    return true;
  }
}

function createDateBaseValidator(typeString) {
  const [sqlType, isNull] = parseTypeString(typeString);
  const dr = new Range(0, 31);
  const mr = new Range(0, 12);
  return (val = null) => {
    if (isNullStr(val)) return isNull ? true : false;

    const dateArr = val.split('-');
    if (dateArr.length < 3) return false;
    const [y, m, d] = dateArr;
    if (y.length !== 4 || m.length !== 2 || d.length !== 2) return false;
    if (!dr.inRange(+d) || !mr.inRange(+m)) return false;
    val = new Date(...dateArr);

    if (Number.isNaN(val.getTime())) return false; //Invalid Date

    if (val.getTime() > MYSQL_CONFIG.date.to.getTime()
      || val.getTime() < MYSQL_CONFIG.date.from.getTime()) {
      return false;
    }
    return true;
  }
}

module.exports = {
  createIntBaseValidator,
  createStringBaseValidator,
  createDateBaseValidator,

};

