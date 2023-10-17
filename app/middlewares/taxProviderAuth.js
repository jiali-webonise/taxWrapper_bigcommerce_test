const winston = require('winston');
const { BAD_REQUEST, UNAUTHORIZED } = require('../../config/api-config');
const { AUTH_TAX_PROVIDER } = process.env;

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
  const authorizationCode = req.headers.authorization;
  if (authorizationCode === null) return res.status(BAD_REQUEST.code).send({ error: 'Token not present' });

  if (!authorizationCode || authorizationCode !== `Basic ${AUTH_TAX_PROVIDER}`) {
    winston.error(`${UNAUTHORIZED.code} - ${UNAUTHORIZED.description}`);
    return res.status(UNAUTHORIZED.code).send({ error: UNAUTHORIZED.description });
  }
  next();
};

module.exports = {
  isBCTaxProviderAuthenticated,
};
