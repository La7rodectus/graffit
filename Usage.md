# Graffit Usage #  
## Table Of Contents ##
- [Creating and using connections](#creating-and-using-connections)  
- [Select](#select)  
- [Insert](#insert)  
- [Update](#update)  
- [Delete](#delete)  
### Creating and using connections ###  
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
