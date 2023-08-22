const winston = require('winston');
const { BAD_REQUEST, UNAUTHORIZED } = require('../../config/api-config');
const { ACCESS_TOKEN } = process.env;

/**
 * Confirm API call is authenticated
 *
 * @return  {Object} Express response object.
 * @param   {Object}   req         Express request object.
 * @param   {Object}   res         Express response object.
 * @param   {function} next        Express next function. Pass control to next middleware.
 */
const isBCTaxProviderAuthenticated = async (req, res, next) => {
  // confirm correct auth headers are sent with request and access token is present
  const authToken = req.headers['x-auth-token'];
  if (authToken === null) return res.status(BAD_REQUEST.code).send({ error: 'Token not present' });

  if (!authToken || authToken !== ACCESS_TOKEN) {
    winston.error(`${UNAUTHORIZED.code} - ${UNAUTHORIZED.description}`);
    return res.status(UNAUTHORIZED.code).send({ error: UNAUTHORIZED.description });
  }
  next();
};

module.exports = {
  isBCTaxProviderAuthenticated,
};
