const {NoResultsError} = require("../services/error-service");

const users = [{id: 1, username: 'John'}, {id: 2, username: 'Kim'}]
/**
 * Get users from CTM PostgreSQL database
 * You have the option to search by individual fields or all string searchable fields.
 * @return  {Object} Express response object.
 * @param   {Object}   req         Express request object.
 * @param   {Object}   res         Express response object.
 */
const getUsers = async (req, res) => {
  const userResponse = users;
  return res.status(200).send(userResponse);
};

/**
 * Get a user from CTM PostgreSQL database
 *
 * @return  {Object} Express response object.
 * @param   {Object}   req         Express request object.
 * @param   {Object}   res         Express response object.
 */
const getUser = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) {
    throw new NoResultsError();
  }
  const userResponse = users.find(el => el.id === id);
  return res.status(200).send(userResponse);
};

module.exports = {
  getUsers,
  getUser,
};