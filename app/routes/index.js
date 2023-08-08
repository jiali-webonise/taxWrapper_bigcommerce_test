const {API_BASE_PATH, RESOURCE} = require('../../config/constants.js');
const userRoutes = require('./users.js');
const authRoutes = require('./auth.js');
const loadRoutes = require('./load.js');
const uninstallRoutes = require('./uninstall.js');


module.exports = function (app) {
  app.use(function (req, res, next) {
    Object.keys(req.body).forEach(function (key) {
      req.body[key] = typeof req.body[key] == 'string' && req.body[key] === '' ? null : req.body[key];
    });
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });
  app.use(`${API_BASE_PATH}/${RESOURCE.AUTH}`, authRoutes);
  app.use(`${API_BASE_PATH}/${RESOURCE.LOAD}`, loadRoutes);
  app.use(`${API_BASE_PATH}/${RESOURCE.UNINSTALL}`, uninstallRoutes);

  app.use(`${API_BASE_PATH}/${RESOURCE.USERS}`, userRoutes);

  app.use((req, res) => {
    res.status(404).send({
      message: "Not Found",
      data: null
    });
  });
};