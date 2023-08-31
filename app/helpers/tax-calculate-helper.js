const { roundOffValue } = require('../../util/util');

const getAmountExclusiveByTaxRate = (amountInclusive, taxRate) => {
  const result = amountInclusive / (1 + taxRate);
  return roundOffValue(result);
};

const getAmountInclusiveByTaxRate = (amountExclusive, taxRate) => {
  const result = amountExclusive * (1 + taxRate);
  return roundOffValue(result);
};

module.exports = {
  getAmountExclusiveByTaxRate,
  getAmountInclusiveByTaxRate,
};
