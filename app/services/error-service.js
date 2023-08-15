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

module.exports = {
  use,
  NoResultsError,
};
