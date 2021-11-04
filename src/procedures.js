const replaceAt = require('../helpers.js').replaceAt;
const { wrapStr, wrapUpdateObjFields } = require('../helpers.js');


const insertIntoTable = (conn, tableName, insertObj) => {
  insertObj = wrapUpdateObjFields(insertObj);
  const values = Object.values(insertObj).join(', ');
  const fields = Object.keys(insertObj).join(', ');
  ///
  console.log(fields, '\n', values);
  ///
  const q = `
    INSERT INTO ${tableName} ( ${fields} )
    VALUES ( ${values} );
  `;
  return new Promise((resolve, reject) => {
    conn.query(q, (err, res) => {
      if (err) {
        reject(err)
      }
      resolve(res);
    });
  });
}

const descTable = (conn, name) => {
  return new Promise((resolve, reject) => {
    const q = `DESC ${name}`;
    conn.query(q, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};

const getBaseTableNames = (conn) => {
  const q = `SELECT table_name FROM information_schema.tables WHERE table_type = 'base table'`;
  return new Promise((resolve, reject) => {
    conn.query(q, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};

const getAllFromTable = (conn, tableName) => {
  const q = `SELECT * FROM ${tableName}`;
  return new Promise((resolve, reject) => {
    conn.query(q, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};

const getFromTableBy = (conn, tableName, whereIdField, someId) => {
  someId = wrapStr(someId);
  const q = `SELECT * FROM ${tableName} WHERE ${whereIdField} = ${someId};`;
  return new Promise((resolve, reject) => {
    conn.query(q, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};

const updateTable = (conn, tableName, whereIdField, someId, updateObj) => {
  let setRow = '';
  updateObj = wrapUpdateObjFields(updateObj);
  someId = wrapStr(someId);
  for (const field in updateObj) setRow += `${field} = ${updateObj[field]},\n`;
  const lastComaId = setRow.lastIndexOf(',');
  setRow = replaceAt(setRow, lastComaId, ' ');
  const q = `
    UPDATE ${tableName}
    SET
      ${setRow}
    WHERE
      ${whereIdField} = ${someId};
  `;
  return new Promise((resolve, reject) => {
    conn.query(q, (err, res) => {
      if (err) {
        reject(err)
      }
      resolve(res);
    });
  });
};

const deleteRowsFromTable = (conn, tableName, whereIdField, someId) => {
  someId = wrapStr(someId);
  const q = `DELETE FROM ${tableName} WHERE ${whereIdField} = ${someId};`;
  return new Promise((resolve, reject) => {
    conn.query(q, (err, res) => {
      if (err) {
        reject(err)
      }
      resolve(res);
    });
  });
};

module.exports = {
  updateTable,
  deleteRowsFromTable,
  insertIntoTable,
  getBaseTableNames,
  descTable,
  getAllFromTable,
  getFromTableBy,
  
};