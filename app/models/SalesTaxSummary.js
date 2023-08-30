class SalesTaxSummary {
  constructor({ name, rate, amount, taxClass, id }) {
    this.name = name;
    this.rate = rate; //tax_rate
    this.amount = amount; //total_tax
    this.tax_class = taxClass;
    this.id = id;
  }
  setName(name) {
    this.name = name;
  }
  setRate(rate) {
    this.rate = rate;
  }
  setAmount(amount) {
    this.amount = amount;
  }
  setTaxClass(taxClass) {
    this.tax_class = taxClass;
  }
  setId(id) {
    this.id = id;
  }
}

module.exports = { SalesTaxSummary };
