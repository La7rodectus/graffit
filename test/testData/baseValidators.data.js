
module.exports = {
  schemaInt: {
    tables: {
      Persons: {
        fields: {
          PersonID: 'int(11)|null',
          LastName: 'varchar(255)|null',
          FirstName: 'char(11)|null',
          Address: 'varchar(255)|null',
          City: 'varchar(255)|null',
        },
        FK:[],
        name:'Persons',
      }
    }
  }
};
