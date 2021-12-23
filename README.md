# Graffit
Hello! Graffit is a lib for easy work with DB. Currently we are in process of development, so not many features are available.  
  


## Purposes
Our goal for now is to provide a simple and similar structure for any SQL database ( for now only mysql is supported).

## Methods
### class Graffit

constructor(): do nothing

createController(conn_obj, options): dbc class for connected DB

readSchema(conn_obj): object of DB schema

```
{
  name: null,
  tables: {
    Persons: {
      PersonID: 'int(11)',
      LastName: 'varchar(255)',
      FirstName: 'varchar(255)',
      Address: 'varchar(255)',
      City: 'varchar(255)'
    }
  }
}
```

### class DBC

dbc.
constructor(schema, options): do nothing
this.[tableName] = new Table(name)


```
const defaultOptions = {
  dbdv: DatabaseDataValidator,
  maxConnectionsPull: 5,
};
```

init(): create first connection to DB



