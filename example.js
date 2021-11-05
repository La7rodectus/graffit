const Graffit = require('./src/graffit.js').default;

const connObj = {
  host: 'sql4.freemysqlhosting.net',
  user: 'sql4448941',
  password: 'cPG4z3wKKX',
  database: 'sql4448941'
};

console.log('Example start');
(async () => {
  let res;

  try {
    const dbc = Graffit.createController(connObj);
    const err = await dbc.init();
    if (err) return console.log('const error connect:', err);
    res = await dbc.Persons.getAll();
  } catch (err) {
    console.log('catch error:', err);
  }
  console.log('res:', res);
  console.log('Example end');
})();
