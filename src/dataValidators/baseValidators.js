
function parseTypeString(str) {
  return str.split('|');
}

function createIntBaseValidator(typeString) {
  const [sqlType, isNull] = parseTypeString(typeString);
  let [type, len] = sqlType.slice(0, -1).split('(');
  len = +len;
  return (val = null) => {
    if (!val && val !== 0 && !Number.isNaN(val)) {
      if (isNull) return true;
      else return false;
    }
    else if (!Number.isInteger(val)) return false;
    else if (Math.abs(val).toString().length > len) return false;
    return true;
  }
}

function createStringBaseValidator(typeString) {
  const [sqlType, isNull] = parseTypeString(typeString);
  let [type, len] = sqlType.slice(0, -1).split('(');
  len = +len;
  return (val = null) => {
    if (!val && val !== '' && !Number.isNaN(val)) {
      if (isNull) return true;
      else return false;
    }
    else if (!(typeof val === 'string') && !(val instanceof String)) return false;
    else if (val.length > len) return false;
    return true;
  }
}

module.exports = {
  createIntBaseValidator,
  createStringBaseValidator,

};

