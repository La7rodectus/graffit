class UniqueStringsGenerator {
  #strings;
  constructor(stringsObj) {
    this.#strings = stringsObj;
  }

  generateUniqueString(tableName = '', key = '') {
    const letter = tableName.slice(0, 1) + key.slice(0, 1);
    let string = letter;
    let i = 1;
    while (Object.values(this.#strings).indexOf(string) !== -1) {
      string = letter;
      string += i;
    }
    if (tableName !== '') this.#strings[tableName + key] = string;
    return string;
  }

}

module.exports = { UniqueStringsGenerator };
