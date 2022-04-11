require('dotenv').config();

const Graffit = require('../src/graffit');


const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;
const connObj = {
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
};

console.log('Example start');
(async () => {
  try {
    const dbc = Graffit.createController(connObj);
    const err = await dbc.init(); // init => error | other methods => client wrap in try catch
    if (err) return console.log('const error connect:', err);
    const pl = await dbc.places.insert({ 'place_name': 'Шанхай' }, { 'place_name': 'Нью-Делі' }).do();
    console.log('pl', pl);
    const res = await dbc.places.get().do();
    console.log('res:', res);
  } catch (err) {
    console.log('catch error:', err);
  }
  console.log('Example end');
})();

//chain examples
// await dbc.flights.get()
// .orderBy('flight_name', 'DESC')
// .where('ticket_price')
// .between(1, 2000)
// .and()
// .more(4, 'flight_id')
// .endWhere()
// .do();
