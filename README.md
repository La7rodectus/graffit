# Graffit #  
## Table Of Contents ##
- [About](#about)  
- [Purposes](#purposes)
- [Creating and using connections](#creating-and-using-connections)  
- [Select](#select)  
- [Insert](#insert)  
- [Update](#update)  
- [Delete](#delete)  
### About ###
Hello! Graffit is a lib for easy work with DB. Currently we are in process of development, so not many features are available.  

### Purposes ###
Our goal for now is to provide a simple and similar structure for any SQL database ( for now only mysql is supported).

### Creating and using connections ###  
*this part is under development*
See example of creating and using connections[here](example.js)
#### class Graffit ####

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

#### class DBC ####

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
### Select ###
*select works, but documentation is in development*
### Insert ###
Using *Insert* is pretty easy. All you need to do is call method insert on table, which you want to use.  
Inside you should pass an object, containing names of fields as keys and values, corresponding each other.  
Do not forget to call *do()*.
```
dbc.sqlTable.insert({field1: 'value1', field2: 'value2'}).do();
```
To insert many rows at once pass into the insert method many objects, corresponding to the inserts, you want to make.  
```
dbc.sqlTable.insert({field1: 'value11', field2: 'value21'}, {field1: 'value12', field2: 'value22'}).do();
```
Please, note, that structure of objects should be the same (keys in each object should match).
### Update ###
*no implementation yet*
### Delete ###
*no implementation yet*

