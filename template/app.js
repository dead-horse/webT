/*!
 * {{projectName}} - app.js
 * Copyright(c) 2013
 * Author: {{authName}} <{{authEmail}}>
 */

'use strict';

/**
 * Module dependencies.
 */

require('response-patch');
var http = require('http');
var path = require('path');
var connect = require('connect');
var render = require('connect-render');
var urlrouter = require('urlrouter');
// @logger
var logger = require('./common/logger');
// @end
// @redis
var RedisStore = require('connect-mredis')(connect);
// @end
// @socketIo
//socket.io
var SocketIO = require('socket.io');
var sioRoutes = require('./sio_routes');
// @end

var config = require('./config');
var routes = require('./routes');

// @restfulWrap
var apiRoutes = require('./api_routes');
// @end

var PUBLIC_DIR = path.join(__dirname, 'public');

var app = connect();

app.use('/public', connect.static(PUBLIC_DIR));
app.use(function (req, res, next) {
  res.req = req;
  next();
});

//parse http get params
app.use(connect.query());

//parse http post body
app.use(connect.urlencoded());
app.use(connect.json({
  strict: true
}));

//parse cookie
app.use(connect.cookieParser());

//session
app.use(connect.session({
  key: config.sessionCookie,
  secret: config.sessionSecret,
// @redis
  store: new RedisStore(config.redis),
// @end
  cookie: { path: '/', httpOnly: true},
}));

//handle csrf, do not open it when
if (process.env.NODE_ENV !== 'test') {
  app.use(connect.csrf());
}

/**
 * res.render helpers
 */
var helpers = {
  config: config,
  csrf: function (req) {
    return req.csrfToken ? req.csrfToken() : '';
  }
};

app.use(render({
  root: path.join(__dirname, 'views'),
  viewExt: '.html',
  layout: 'layout',
  cache: config.viewCache,
  helpers: helpers
}));

// @restfulWrap
/**
 * Data API URL routing
 */
var API_BASE_URL = '/api';
app.use(API_BASE_URL, urlrouter(apiRoutes));
app.use(API_BASE_URL, apiRoutes.notFound);
app.use(API_BASE_URL, apiRoutes.error);
// @end

/**
 * Web site URL routing
 */
app.use(urlrouter(routes));

/**
 * Error handler
 */
app.use(function (err, req, res, next) {
  err.url = err.url || req.url;
  console.error(err);
  console.error(err.stack);
// @logger
  logger.error(err);
// @end
  if (config.debug) {
    return next(err);
  }
  res.statusCode = 500;
  res.send('Server has some problems. :(');
});

var server = module.exports = http.createServer(app);
// @socketIo
var sio = SocketIO.listen(server);
sioRoutes(sio);
// @end
