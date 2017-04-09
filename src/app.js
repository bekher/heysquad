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
const ipcSock = require('socket.io-client')('http://localhost:8081/');

const webpack = require('webpack');
const config = require('../webpack.config.js');

const app = feathers();
const compiler = webpack(config);

app.configure(configuration(path.join(__dirname, '..')));

app.use(compress())
  .options('*', cors())
  .use(cors())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(hooks())
  .configure(rest())
  .configure(socketio())
  .configure(services)
  .use(require('webpack-dev-middleware')(compiler, {
    noInfo: false,
    publicPath: config.output.publicPath,
    watchOptions: {
      aggregateTimeout: 300,
      poll: true
    },
  }))
  .use(require('webpack-hot-middleware')(compiler))
  .use('/', serveStatic( app.get('public') ))
  .use(favicon( path.join(app.get('public'), 'favicon.ico') ))
  .configure(middleware);
app.ipcSock = ipcSock;
ipcSock.on('recs', (res) => {
  console.log("new rec");
  console.log(recs);
  /*
  app.service('groups').patch(res.group, {

  });
  */
});

module.exports = app;
