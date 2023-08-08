const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// use JSON and URLEncoded for requests
app.use(express.json());
app.use(express.urlencoded({extended: false}));
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