'use strict';

const path = require('path');
const serveStatic = require('feathers').static;
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const feathers = require('feathers');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const bodyParser = require('body-parser');
const socketio = require('feathers-socketio');
const middleware = require('./middleware');
const services = require('./services');

const webpack = require('webpack');
const config = require('../webpack.config.js');

const app = feathers();

app.configure(configuration(path.join(__dirname, '..')));

app.use(compress())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(hooks())
  .configure(rest())
  .configure(socketio())
  .configure(services)
  .configure(middleware);

// Host the REST api under /api
 const fullapp = feathers().use('/api', app);
 const compiler = webpack(config);

fullapp.use(require('webpack-dev-middleware')(compiler, {
    noInfo: false,
    publicPath: config.output.publicPath,
    watchOptions: {
      aggregateTimeout: 300,
      poll: true
    },
  }))
  .use(require('webpack-hot-middleware')(compiler))
  .configure(configuration(path.join(__dirname, '..')))
  .options('*', cors())
  .use(cors())
  .use('/', serveStatic( app.get('public') ))
  .use(favicon( path.join(app.get('public'), 'favicon.ico') ));

module.exports = fullapp;
