
class Schema {
  constructor(name) {
    this.tables = Object.create(null);
    this.name = name;
  }

  addTable(table) {
    this.tables[table.name] = table;
  }

  getTables() {
    return this.tables;
  }

}

module.exports = Schema;
