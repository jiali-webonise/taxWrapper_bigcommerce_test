const { TaxProviderResponseObject } = require('../models/TaxProviderResponseObject');
const { SalesTaxSummary } = require('../models/SalesTaxSummary');
const { AVALARA_PATH } = require('../../config/constants');
const { getAmountExclusiveByTaxRate, getAmountInclusiveByTaxRate } = require('./tax-calculate-helper');
const { roundOffValue, getFlatTaxRate, getMetaDataFormat } = require('../../util/util');
const { getAvalaraCreateTransactionRequestBody } = require('../../util/avalara');
const { postAvalaraService } = require('../services/avalara-service');
const { updateCardMetaData } = require('../services/bigcommerce-service');

/**
 * Transform response to meet BC requirement
 *
 * @param   {Object}    documents      documents(cart data) received from BC
 * @param   {String}    quoteId        quoteId received from BC Tax Provider API
 */
const getTransformedResponseByFlatTaxRate = async (
  documents,
  quoteId,
  countryCode,
  isExempted,
  storeHash,
  metaDataId,
) => {
  const { flatTaxRate, shippingTaxRate } = getFlatTaxRate(countryCode);
  const data = {};
  const transformedDocs = documents.map((document) => {
    const items = document.items;
    let metaDataArr = {
      items: [],
      documents: document.items,
    };
    const transformedItems = items.map((item) => {
      const transformedItem = getCalculatedResponseByTaxRate(item, flatTaxRate, isExempted);
      metaDataArr?.items?.push(JSON.parse(JSON.stringify(transformedItem)?.split('TaxProviderResponseObject')));
      return transformedItem;
    });
    const shipping = getCalculatedResponseByTaxRate(document.shipping, shippingTaxRate, isExempted);
    metaDataArr.shipping = JSON.parse(JSON.stringify(shipping)?.split('TaxProviderResponseObject'));
    // Modere doesn't have Handling fee but BC ask for this attribute
    const handling = getCalculatedResponseByTaxRate(document.handling, 0);
    metaDataArr.handling = JSON.parse(JSON.stringify(handling)?.split('TaxProviderResponseObject'));
    data[document.id] = metaDataArr;
    return { id: document.id, items: transformedItems, shipping: shipping, handling: handling };
  });
  //create card metaData
  const metaData = getMetaData(data, true);
  const requestBodyForCartMetadata = getMetaDataFormat(metaData);
  if (metaDataId) {
    const res = await updateCardMetaData({
      url: String(`${storeHash}/v3/carts/${quoteId}/metafields/${metaDataId}`),
      body: requestBodyForCartMetadata,
      storeHash,
    });
    console.log('res', res);
  }
  console.log('transform docs>>', transformedDocs);
  return { documents: transformedDocs, id: quoteId };
};

const getMetaData = (data, isFlatTaxMarket) => {
  if (isFlatTaxMarket) {
    const obj = Object.keys(data)?.map((itemkey) => {
      const item = data[itemkey];
      let itemsArr = item?.items?.map((line) => {
        const lineItemData = {
          id: line?.id,
          taxableAmount: line?.price?.amount_exclusive,
          taxCalculated: line?.price?.total_tax,
        };
        return lineItemData;
      });
      const handling = {
        id: item?.handling?.id,
        taxableAmount: item?.handling?.price?.amount_exclusive,
        taxCalculated: item?.handling?.price?.total_tax,
      };
      const shipping = {
        id: item?.shipping?.id,
        taxableAmount: item?.shipping?.price?.amount_exclusive,
        taxCalculated: item?.shipping?.price?.total_tax,
      };
      return {
        id: itemkey,
        data: [...itemsArr, handling, shipping],
      };
    });

    return obj;
  }
  const items = data?.lines;
  const lineItemArray = items?.map((item) => {
    const obj = {
      itemCode: item?.itemCode,
      taxCode: item?.taxCode,
      taxableAmount: item?.taxableAmount,
      taxRate: item?.tax,
      taxCalculated: item?.taxCalculated,
    };
    return obj;
  });
  return lineItemArray;
};

const getTransformedResponseFromAvalara = async (data, storeHash, documents, quoteId, commit, metaDataId) => {
  const avalaraRequestBody = getAvalaraCreateTransactionRequestBody(data, storeHash, commit);
  const avalaraResponse = await postAvalaraService({ url: AVALARA_PATH.CREATE_TRANSICATION, body: avalaraRequestBody });
  console.log('avalaraRequestBody', avalaraRequestBody);
  console.log('avalaraResponse', avalaraResponse);
  //create card metaData
  const dataFormat = getMetaData(avalaraResponse, false);
  const requestBodyForCartMetadata = getMetaDataFormat(dataFormat);
  if (metaDataId) {
    const res = await updateCardMetaData({
      url: String(`${storeHash}/v3/carts/${quoteId}/metafields/${metaDataId}`),
      body: requestBodyForCartMetadata,
      storeHash,
    });
    console.log('res', res);
  }
  if (!avalaraResponse) {
    return avalaraResponse;
  }
  // Create response in BC format
  if (avalaraResponse && avalaraResponse.lines) {
    const transformedDocs = documents.map((document) => {
      const items = document.items;
      const transformedItems = items.map((item) => {
        const transformedItem = getTaxFromAvalaraResponse(item, avalaraResponse?.lines);
        return transformedItem;
      });
      // TODO: Update for shipping rate
      const shipping = getTaxFromAvalaraResponse(document.shipping, avalaraResponse?.lines);
      const handling = getTaxFromAvalaraResponse(document.handling, avalaraResponse?.lines);
      return { id: document.id, items: transformedItems, shipping: shipping, handling: handling };
    });
    if (commit) {
      return { documents: transformedDocs, id: quoteId, external_id: avalaraResponse?.id };
    }
    return { documents: transformedDocs, id: quoteId };
  }
};

/**
 * Calculate some attributes in response
 *
 * @param   {Object}    responseObject   object received from BC Tax Provider API
 */
const getCalculatedResponseByTaxRate = (responseObject, taxRate, isExempted) => {
  const calculatedPrice = {};
  calculatedPrice.tax_rate = taxRate;
  switch (isExempted) {
    case true:
      calculatedPrice.amount_exclusive = responseObject.price.amount;
      calculatedPrice.amount_inclusive = responseObject.price.amount;
      calculatedPrice.tax_rate = taxRate;
      calculatedPrice.total_tax = 0;
      break;
    default:
      if (responseObject.price.tax_inclusive) {
        calculatedPrice.amount_inclusive = responseObject.price.amount;
        calculatedPrice.amount_exclusive = getAmountExclusiveByTaxRate(
          calculatedPrice.amount_inclusive,
          calculatedPrice.tax_rate,
        );
        calculatedPrice.total_tax = roundOffValue(calculatedPrice.amount_inclusive - calculatedPrice.amount_exclusive);
      } else {
        calculatedPrice.amount_exclusive = responseObject.price.amount;
        calculatedPrice.amount_inclusive = getAmountInclusiveByTaxRate(
          calculatedPrice.amount_exclusive,
          calculatedPrice.tax_rate,
        );
        calculatedPrice.total_tax = roundOffValue(calculatedPrice.amount_inclusive - calculatedPrice.amount_exclusive);
      }
  }
  const salesSummary = new SalesTaxSummary({
    name: 'Tax',
    rate: calculatedPrice.tax_rate,
    amount: calculatedPrice.total_tax,
    taxClass: responseObject.tax_class,
    id: 'Tax',
  });
  const result = new TaxProviderResponseObject({
    id: responseObject.id,
    price: calculatedPrice,
    type: responseObject.type,
    salesTaxSummary: [salesSummary],
  });
  return result;
};

const getTaxFromAvalaraResponse = (item, avalaraResponseLines) => {
  const calculatedPrice = { tax_rate: 0 };
  const avalaraItem = avalaraResponseLines.find((el) => el.itemCode === item['item_code']);
  let taxClassCode = '';
  let taxAmount = avalaraItem.tax;

  // Currently, hardcode the handling amount to 0 because without it cannot have show correct tax in BC
  if (item.id.includes('handling')) {
    calculatedPrice.amount_exclusive = 0;
    calculatedPrice.total_tax = 0;
    calculatedPrice.amount_inclusive = 0;
    taxAmount = 0;
  } else if (avalaraItem && !item.price.tax_inclusive) {
    calculatedPrice.amount_exclusive = item.price.amount;
    calculatedPrice.total_tax = avalaraItem.tax;
    calculatedPrice.amount_inclusive = calculatedPrice.amount_exclusive + calculatedPrice.total_tax;
  }
  // TODO: Handle condition when item.price.tax_inclusive is true if there is
  // TODO: Handle when avalaraItem is undefined

  if (avalaraItem) {
    avalaraItem?.details?.forEach((detail) => {
      calculatedPrice.tax_rate += detail.rate;
      taxClassCode = detail.country;
    });
  }
  // Can only have one salesTaxSummary and the tax rate is the total tax rate
  const salesTaxSummary = new SalesTaxSummary({
    name: 'Tax',
    rate: calculatedPrice.tax_rate,
    amount: taxAmount,
    taxClass: { ...item.tax_class, code: taxClassCode },
    id: 'Tax',
  });

  const result = new TaxProviderResponseObject({
    id: item.id,
    price: calculatedPrice,
    type: item.type,
    salesTaxSummary: [salesTaxSummary],
  });
  return result;
};

module.exports = {
  getTransformedResponseByFlatTaxRate,
  getTransformedResponseFromAvalara,
  getCalculatedResponseByTaxRate,
  getTaxFromAvalaraResponse,
  getMetaData,
};
