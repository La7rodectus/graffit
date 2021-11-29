const Graffit = require('./src/graffit.js').default;

const connObj = {
  "host": "sql11.freemysqlhosting.net",
  "user": "sql11454908",
  "password": "ghkhHRPw8z",
  "database": "sql11454908",
};

console.log('Example start');
(async () => {
  let res;

  try {
    const dbc = Graffit.createController(connObj);
    const err = await dbc.init(); //init => error | other methods => client wrap in try catch
    if (err) return console.log('const error connect:', err);
    res = await dbc.flights.get()
                           .orderBy('flight_name', 'DESC')
                           .where('ticket_price')
                           .equals(3000)
                           .do(); //.orderBy().do();
  } catch (err) {
    console.log('catch error:', err);
  }
  console.log('res:', res);
  console.log('Example end');
})();
