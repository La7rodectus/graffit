const Graffit = require('./src/graffit.js').default;

const connObj = {
  "host": "sql11.freemysqlhosting.net",
  "user": "sql11452212",
  "password": "W7lHHlYBFS",
  "database": "sql11452212",
};

console.log('Example start');
(async () => {
  let res;

  try {
    const dbc = Graffit.createController(connObj);
    const err = await dbc.init(); //init => error | other methods => client wrap in try catch
    await dbc.connDestroy();
    if (err) return console.log('const error connect:', err);
    res = await dbc.flights.getAll();
    await dbc.connDestroy();
  } catch (err) {
    console.log('catch error:', err);
  }
  console.log('res:', res);
  console.log('Example end');
})();
