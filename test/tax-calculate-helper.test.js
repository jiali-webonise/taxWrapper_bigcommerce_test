const { assert } = require('chai');
const { describe, it } = require('mocha');
const { getAmountExclusiveByTaxRate, getAmountInclusiveByTaxRate } = require('../app/helpers/tax-calculate-helper');
const { roundOffValue } = require('../util/util');

describe('tax-calculate-helper method test', () => {
  describe('testing getAmountExclusiveByTaxRate', () => {
    it('should return getAmountExclusiveByTaxRate value accordingly', () => {
      const result = getAmountExclusiveByTaxRate(100, 0.15);
      assert.equal(result, roundOffValue(100 / 1.15));
    });
  });
  describe('testing getAmountInclusiveByTaxRate', () => {
    it('should return getAmountInclusiveByTaxRate value accordingly', () => {
      const result = getAmountInclusiveByTaxRate(100, 0.15);
      assert.equal(result, roundOffValue(100 * 1.15));
    });
  });
});
