/**
 * TaxProviderResponseObject can be used to construct Item, Shipping, Handling object that are returned to BC
 */
class TaxProviderResponseObject {
  constructor({ id, price, type, salesTaxSummary }) {
    (this.id = id),
      (this.price = {
        amount_inclusive: price.amount_inclusive,
        amount_exclusive: price.amount_exclusive,
        total_tax: price.total_tax,
        tax_rate: price.tax_rate,
        sales_tax_summary: salesTaxSummary,
      });
    this.type = type;
  }
}

module.exports = {
  TaxProviderResponseObject,
};
