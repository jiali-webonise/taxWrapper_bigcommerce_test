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
  }
};
