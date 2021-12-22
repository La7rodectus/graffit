
const Graffit = require('./src/graffit.js');

const connObj = {
  host: 'localhost',
  user: 'liza',
  password: '#Cactuz555',
  database: 'web_aviatickets',
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
