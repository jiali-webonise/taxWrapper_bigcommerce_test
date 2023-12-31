const { assert } = require('chai');
const { describe, it } = require('mocha');
const {
  getCountryCode,
  checkNumberIsNaNAndInfinity,
  roundOffValue,
  checkIsFlatTaxRate,
  getFlatTaxRate,
  isSame,
} = require('../util/util');
const { InternalError } = require('../app/services/error-service');

describe('utils method test', () => {
  describe('testing getCountryCode', () => {
    it('should return country code accordingly', () => {
      const {
        US_BIGCOMMERCE_STORE_HASH,
        CA_BIGCOMMERCE_STORE_HASH,
        AU_BIGCOMMERCE_STORE_HASH,
        NZ_BIGCOMMERCE_STORE_HASH,
        JP_BIGCOMMERCE_STORE_HASH,
        IN_BIGCOMMERCE_STORE_HASH,
        EU_BIGCOMMERCE_STORE_HASH,
        WEBONISELAB_STORE_HASH,
      } = process.env;
      const storeHashList = [
        US_BIGCOMMERCE_STORE_HASH,
        CA_BIGCOMMERCE_STORE_HASH,
        AU_BIGCOMMERCE_STORE_HASH,
        NZ_BIGCOMMERCE_STORE_HASH,
        JP_BIGCOMMERCE_STORE_HASH,
        IN_BIGCOMMERCE_STORE_HASH,
        EU_BIGCOMMERCE_STORE_HASH,
      ];
      const storeHashMap = {
        US_BIGCOMMERCE_STORE_HASH: 'US',
        CA_BIGCOMMERCE_STORE_HASH: 'CA',
        AU_BIGCOMMERCE_STORE_HASH: 'AU',
        NZ_BIGCOMMERCE_STORE_HASH: 'NZ',
        JP_BIGCOMMERCE_STORE_HASH: 'JP',
        IN_BIGCOMMERCE_STORE_HASH: 'IN',
        EU_BIGCOMMERCE_STORE_HASH: 'EU',
      };
      storeHashList.forEach((hash) => {
        const result = getCountryCode(hash);
        assert.equal(result, storeHashMap[hash]);
      });
    });
  });

  describe('testing checkNumberIsNaNAndInfinity', () => {
    it('should return value accordingly', () => {
      const v1 = 10;
      const result1 = checkNumberIsNaNAndInfinity(v1);
      assert.equal(result1, v1);
      const v2 = '20';
      const result2 = checkNumberIsNaNAndInfinity(v2);
      assert.equal(result2, Number(v2));
      const v3 = '@';
      const result3 = checkNumberIsNaNAndInfinity(v3);
      assert.equal(result3, 0);
    });
  });

  describe('testing roundOffValue', () => {
    it('should return roundOff value accordingly', () => {
      const v1 = 10;
      const result1 = roundOffValue(v1, null, true);
      assert.equal(result1, v1);
      const v2 = 10.11111111;
      const result2 = roundOffValue(v2, 3, false);
      assert.equal(result2, Number(v2.toFixed(3)));
      const v3 = 10.11111111;
      const result3 = roundOffValue(v3);
      assert.equal(result3, Number(v3.toFixed(2)));
    });
  });

  describe('testing checkIsFlatTaxRate', () => {
    it('should return checkIsFlatTaxRate value accordingly', () => {
      const result1 = checkIsFlatTaxRate(null);
      assert.equal(result1, false);
      const result2 = checkIsFlatTaxRate('JP');
      assert.equal(result2, true);
      const result3 = checkIsFlatTaxRate('US');
      assert.equal(result3, false);
    });
  });

  describe('testing getFlatTaxRate', () => {
    it('should return getFlatTaxRate value accordingly', () => {
      assert.throws(() => getFlatTaxRate(null), InternalError);
      const result2 = getFlatTaxRate('JP');
      assert.equal(JSON.stringify(result2), JSON.stringify({ flatTaxRate: 0.1, shippingTaxRate: 0.1 }));
    });
  });

  describe('testing isSame', () => {
    it('should return isSame value', () => {
      const result1 = isSame('US', 'US');
      const result2 = isSame('US', 'CA');

      assert.equal(result1, true);
      assert.equal(result2, false);
    });
  });
});
