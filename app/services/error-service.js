/**
 * Global HOC function to catch errors
 *
 * @return {(function(*, *, *): void)|*}
 * @param fn
 */
const use = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * 400 - Bad Request Error
 *
 * @param {Object}  [args]      Override arguments for Error.
 *                              {status, name, message}
 */
class BadRequestError extends Error {
  constructor(args) {
    const { code, name, message } = args || {};
    super();
    this.status = code ? code : 400;
    this.name = name ? name : 'Bad Request';
    this.message = message
      ? message
      : 'The request could not be understood by the server due to malformed syntax. The client SHOULD NOT repeat the request without modifications.';
  }
}

/**
 * 401 - Unauthorized
 *
 * @param {Object}  [args]      Override arguments for Error.
 *                              {status, name, message}
 */
class UnauthorizedError extends Error {
  constructor(args) {
    const { code, name, message } = args || {};
    super();
    this.status = code ? code : 401;
    this.name = name ? name : 'Unauthorized';
    this.message = message ? message : 'Unauthorized request';
  }
}

/**
 * 404 - No Results Error
 *
 * @param {Object}  [args]      Override arguments for Error.
 *                              {status, name, message}
 */
class NoResultsError extends Error {
  constructor(args) {
    const { code, name, message } = args || {};
    super();
    this.status = code || 404;
    this.name = name || 'No Results Found';
    this.message = message || 'No Results Found';
  }
}

/**
 * 400 - Bad Request Error
 *
 * @param {Object}  [args]      Override arguments for Error.
 *                              {status, name, message}
 */
class InternalError extends Error {
  constructor(args) {
    const { code, name, message } = args || {};
    super();
    this.status = code ? code : 500;
    this.name = name ? name : 'Internal Error';
    this.message = message
      ? message
      : 'The server encountered an unexpected condition which prevented it from fulfilling the request.';
  }
}

module.exports = {
  use,
  BadRequestError,
  NoResultsError,
  UnauthorizedError,
  InternalError,
};
