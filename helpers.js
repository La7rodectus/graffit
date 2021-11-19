'use strict';

const replaceAt = (str, index, replacement) => {
  return str.substr(0, index) + replacement + str.substr(index + replacement.length);
};

const wrapString = (str) => str = typeof str === 'string' ? `'${str}'` : str;

const wrapObjectFields = (object) => {
  const wrapped = { ...object };
  for (const field in object) {
    wrapped[field] = wrapString(object[field]);
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
  wrapString,
  wrapObjectFields,
  parseUrlArgs,
};