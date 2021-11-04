const DBC = require('./src/dbc.js').default;

const conn_obj = {
  host: 'sql11.freemysqlhosting.net',
  user: 'sql11439711',
  password: 'VzUfMWF3Ze',
  database: 'sql11439711'
};


console.log('Example start');
const dbc = new DBC(conn_obj);
(async () => {
  let res;
  
  try {
    const err = await dbc.init();
    if (err) return console.log('const error connect:', err);

  } catch (err) {
    console.log('catch error:', err)
  }
  console.log(res);
  console.log('Example end');
})()
