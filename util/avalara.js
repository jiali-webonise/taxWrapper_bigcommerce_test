const { AVALARA_DOCUMENT_TYPE } = require('../config/constants');
const { getCompanyCode } = require('../util/util');

const getLineItems = (items) => {
  if (items?.length <= 0) return [];
  return items?.map((item, index) => {
    return {
      number: index,
      quantity: item?.quantity,
      amount: item?.price.amount,
      itemCode: item?.item_code,
      taxCode: item?.item_code,
    };
  });
};

const getAddressForAvalara = (address) => {
  return {
    line1: address?.line1,
    city: address?.city,
    region: address?.region_code,
    country: address?.country_code,
    postalCode: address?.postal_code,
  };
};
const getShippingCostLineItem = (shippingData, itemNumber) => {
  const finalData = {
    number: itemNumber,
    quantity: shippingData.quantity,
    amount: shippingData.price.amount,
    itemCode: shippingData.item_code,
    taxCode: shippingData.item_code,
  };
  return finalData;
  //TODO: Need to confirm taxCode for shipping
};

const getAvalaraCreateTransactionRequestBody = (data, storeHash, commit) => {
  const productItems = getLineItems(data?.documents['0'].items);
  const companyCode = getCompanyCode(storeHash);
  const shipFromAddress = getAddressForAvalara(data.documents['0'].origin_address);
  const shipToAddress = getAddressForAvalara(data.documents['0'].destination_address);
  const pointOfOriginAddress = getAddressForAvalara(data.documents['0'].origin_address);
  const docType = commit ? AVALARA_DOCUMENT_TYPE.SALES_INVOICE : AVALARA_DOCUMENT_TYPE.SALES_ORDER;
  const shippingLineItem = getShippingCostLineItem(data.documents['0'].shipping, productItems.length);
  const lineItems = [...productItems, shippingLineItem];
  const customerCode = data.customer.customer_id;
  const exemptionNo = data.customer.taxability_code ? data.customer.taxability_code : null;
  const finalRequestBody = {
    type: docType,
    companyCode: companyCode,
    date: new Date().toISOString()?.slice(0, 10),
    code: data.id,
    customerCode: customerCode,
    commit: commit,
    taxOverride: null,
    currencyCode: data.currency_code,
    description: null,
    exemptionNo: exemptionNo,
    taxDate: data.transaction_date,
    lines: lineItems,
    addresses: {
      singleLocation: null,
      shipFrom: shipFromAddress,
      shipTo: shipToAddress,
      pointOfOrderOrigin: null,
      pointOfOrderAcceptance: null,
    },
  };
  return finalRequestBody;
};
module.exports = {
  getLineItems,
  getAddressForAvalara,
  getAvalaraCreateTransactionRequestBody,
  getShippingCostLineItem,
};
