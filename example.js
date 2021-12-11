const Graffit = require('./src/graffit.js');

const connObj = {
  "host": "sql11.freemysqlhosting.net",
  "user": "sql11456793",
  "password": "isiDi4EVFN",
  "database": "sql11456793",
};

console.log('Example start');
(async () => {
  let res;

  try {
    const dbc = Graffit.createController(connObj);
    const err = await dbc.init(); //init => error | other methods => client wrap in try catch
    if (err) return console.log('const error connect:', err);
    res = await dbc.Persons.select().do()
                          //  .orderBy('flight_name', 'DESC')
                          //  .where('ticket_price')
                          //  .existsIn([13, 88, 67, 3000, 129])
                          //  .and()
                          //  .startExpression()
                          //  .more(4, 'flight_id')
                          //  .or()
                          //  .less(2, 'flight_id')
                          //  .endExpression()
                          //  .endWhere()
                          //  .do();
  } catch (err) {
    console.log('catch error:', err);
  }
  console.log('res:', res);
  console.log('Example end');
})();

// chain examples
// await dbc.flights.select()
// .orderBy('flight_name', 'DESC')
// .where('ticket_price')
// .between(1, 2000)
// .and()
// .more(4, 'flight_id')
// .endWhere()
// .do();
