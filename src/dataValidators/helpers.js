
function isNullCheck(val) {
  return !val && !Number.isNaN(val);
}

function isNullStr(str) {
  return isNullCheck(str) && str !== '';
}

function isNullNum(num) {
  return isNullCheck(num) && num !== 0;
}



module.exports = {
  isNullStr,
  isNullNum,
};
