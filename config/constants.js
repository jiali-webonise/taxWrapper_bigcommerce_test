const path = require('path');

const rootDirectory = path.join(__dirname, '../');

module.exports = {
  ROOT_DIRECTORY: rootDirectory,
  API_BASE_PATH: '/api',
  RESOURCE: {
    USERS: 'user',
    AUTH: 'auth',
    LOAD: 'load',
    UNINSTALL: 'uninstall',
    ESTIMATE: 'tax/estimate',
    COMMIT: 'doc/commit',
    ADJUST: 'doc/adjust',
    VOID: 'doc/void',
  },
  AVALARA_PATH: {
    PING: 'utilities/ping',
    CREATE_TRANSICATION: 'transactions/create'
  },
  FLAT_RATE: {
    JP: .15,
    NZ:.15,
    AU: .15,
  },
  SHIPPING_FLAT_RATE:{
    JP: .1,
  },
  COUNTRY_CODE:{
    US:'US',
    CA:'CA',
    AU:'AU',
    NZ:'NZ',
    JP:'JP',
    IN:'IN',
    EU:'EU'
  },
  AVALARA_DOCUMENT_TYPE:{
    SALES_ORDER: 'salesOrder',
    SALES_INVOICE:'SalesInvoice'
  }
};
