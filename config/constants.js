const path = require('path');
const rootDirectory = path.join(__dirname, '../');

module.exports = {
  ROOT_DIRECTORY: rootDirectory,
  API_BASE_PATH: '/api',
  RESOURCE: {
    USERS: 'user',
  },
};
