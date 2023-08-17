const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { API_BASE_PATH, RESOURCE } = require('../../config/constants.js');
const winston = require('../../config/winston-config.js');
const userRoutes = require('./users.js');
const authRoutes = require('./auth.js');
const loadRoutes = require('./load.js');
const uninstallRoutes = require('./uninstall.js');
const estimateRoutes = require('./estimate.js');
const commitRoutes = require('./commit.js');
const adjustRoutes = require('./adjust.js');
const voidRoutes = require('./void.js');

const options = require('../../config/swagger-config.js');

module.exports = function (app) {
  app.use((req, res, next) => {
    Object.keys(req.body).forEach((key) => {
      req.body[key] = typeof req.body[key] === 'string' && req.body[key] === '' ? null : req.body[key];
    });
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });
  app.use(`${API_BASE_PATH}/${RESOURCE.AUTH}`, authRoutes);
  app.use(`${API_BASE_PATH}/${RESOURCE.LOAD}`, loadRoutes);
  app.use(`${API_BASE_PATH}/${RESOURCE.UNINSTALL}`, uninstallRoutes);

  app.use(`${API_BASE_PATH}/${RESOURCE.ESTIMATE}`, estimateRoutes);
  app.use(`${API_BASE_PATH}/${RESOURCE.COMMIT}`, commitRoutes);
  app.use(`${API_BASE_PATH}/${RESOURCE.ADJUST}`, adjustRoutes);
  app.use(`${API_BASE_PATH}/${RESOURCE.VOID}`, voidRoutes);

  app.use(`${API_BASE_PATH}/${RESOURCE.USERS}`, userRoutes);

  // Swagger Doc URL
  const specs = swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

  app.use((req, res) => {
    winston.error(`${404} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status(404).send({
      message: 'Not Found',
      data: null,
    });
  });
};
