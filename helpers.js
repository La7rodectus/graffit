const replaceAt = (str, index, replacement) => {
  return str.substr(0, index) + replacement + str.substr(index + replacement.length);
};

const wrapStr = (str) => str = typeof str === 'string' ? `'${str}'` : str;

const wrapUpdateObjFields = (updateObj) => {
  const wrapped = { ...updateObj };
  for (const field in updateObj) {
    wrapped[field] = wrapStr(updateObj[field]);
  }
  return wrapped;
}
const parseUrlArgs = (stringToParse) => {
  return JSON.parse('{"' + stringToParse.replace(/&/g, '","').replace(/=/g,'":"') + '"}', (key, value) => {
    return key === "" ? value : decodeURIComponent(value);
  });
}

module.exports = {
  replaceAt,
  wrapStr,
  wrapUpdateObjFields,
  parseUrlArgs,

};