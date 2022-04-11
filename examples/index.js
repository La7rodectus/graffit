const fs = require('fs');
const path = require('path');

fs.readdirSync(__dirname).forEach((fileName) => {
  if (fileName === path.basename(__filename)) return;
  require(path.resolve(__dirname, fileName));
});
