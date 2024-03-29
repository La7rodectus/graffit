const { Range } = require('../utils/utils.js');
const { isNullNum, isNullStr } = require('./helpers.js');

const MYSQL_CONFIG = {
  date: {
    from: new Date('1000-01-01'),
    to: new Date('9999-12-31'),
    format: 'YYYY-MM-DD',
  }
};

function parseTypeString(str) {
  return str.split('|');
}

function createIntBaseValidator(typeString) {
  const [sqlType, isNull] = parseTypeString(typeString);
  const len = +sqlType.slice(0, -1).split('(')[1];
  return (val = null) => {
    if (isNullNum(val)) return !!isNull;

    if (!Number.isInteger(val)) return false;
    if (Math.abs(val).toString().length > len) return false;
    return true;
  };
}

function createStringBaseValidator(typeString) {
  const [sqlType, isNull] = parseTypeString(typeString);
  const len = +sqlType.slice(0, -1).split('(')[1];
  return (val = null) => {
    if (isNullStr(val)) return !!isNull;

    if (!(typeof val === 'string') && !(val instanceof String)) return false;
    if (val.length > len) return false;
    return true;
  };
}

function createDateBaseValidator(typeString) {
  const isNull = parseTypeString(typeString)[1];
  const dr = new Range(1, 31);
  const mr = new Range(1, 12);
  return (val = null) => {
    if (isNullStr(val)) return !!isNull;
    if (!(typeof val === 'string') && !(val instanceof String)) return false;

    const dateArr = val.split('-');
    if (dateArr.length !== 3) return false;
    const [y, m, d] = dateArr;
    if (y.length !== 4 || m.length !== 2 || d.length !== 2) return false;
    if (!dr.inRange(+d) || !mr.inRange(+m)) return false;
    val = new Date(...dateArr);

    if (Number.isNaN(val.getTime())) return false; //Invalid Date

    if (val.getTime() > MYSQL_CONFIG.date.to.getTime() ||
      val.getTime() < MYSQL_CONFIG.date.from.getTime()) {
      return false;
    }
    return true;
  };
}

function createTimeBaseValidator(typeString) {
  const isNull = parseTypeString(typeString)[1];
  const hr = new Range(0, 23);
  const mr = new Range(0, 59);
  const sr = new Range(0, 59);
  return (val = null) => {
    if (isNullStr(val)) return !!isNull;
    if (!(typeof val === 'string') && !(val instanceof String)) return false;

    const timeArr = val.split(':');
    if (timeArr.length !== 3) return false;
    const [h, m, s] = timeArr;
    if (![h, m, s].every((v) => v.length === 2)) return false;
    if (!hr.inRange(+h) || !mr.inRange(+m) || !sr.inRange(+s)) return false;

    return true;
  };
}


function createDateTimeBaseValidator(typeString) {
  const isNull = parseTypeString(typeString)[1];
  const dValidator = createDateBaseValidator(`date|${isNull}`);
  const tValidator = createTimeBaseValidator(`time|${isNull}`);
  return (val = null) => {
    if (isNullStr(val)) return !!isNull;
    if (!(typeof val === 'string') && !(val instanceof String)) return false;
    const [date, time] = val.split(' ');
    return dValidator(date) && tValidator(time);
  };
}

module.exports = {
  createIntBaseValidator,
  createStringBaseValidator,
  createDateBaseValidator,
  createTimeBaseValidator,
  createDateTimeBaseValidator,

};

