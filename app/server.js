const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const compression = require('compression');
const helmet = require('helmet');

const app = express();

/* Helmet can help protect app from some well-known web
vulnerabilities by setting HTTP headers appropriately.*/
app.use(
  helmet({
    contentSecurityPolicy: false,
    xFrameOptions: false,
    // xPermittedCrossDomainPolicies: false,
    // xPoweredBy: false,
    // xXssProtection: false,
    // crossOriginOpenerPolicy: false,
    // xDownloadOptions: false,
    // crossOriginResourcePolicy: false,
    // originAgentCluster: false,
    // referrerPolicy: false,
    // xContentTypeOptions: false,
    // strictTransportSecurity: false,
    // xDnsPrefetchControl: false,
  })
);
// Enabling Gzip compression
app.use(compression());
// use JSON and URLEncoded for requests
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
const corsOptions = {
  origin: '*'
};
app.use(cors(corsOptions));

if (process.env.NODE_ENV === 'development') {
  const serverTimingMiddleware = require('server-timing-header');
  app.use(serverTimingMiddleware({
    sendHeaders: true,
    headers: {server: 'server-timing-header'},
    log: true,
    logLevel: 'info'
  }));
}
// routes
require('./routes')(app);

const PORT = process.env.PORT || '3000'
app.listen(PORT, () => console.log(`Application running on port: ${PORT}`));