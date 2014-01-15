/*!
 * {{projectName}} - config/index.js
 * Copyright(c) 2013
 * Author: {{authName}} <{{authEmail}}>
 */

'use strict';

/**
 * Module dependencies.
 */

var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');

fs.existsSync = fs.existsSync || path.existsSync;
var pkg = require('../package.json');

var root = path.dirname(__dirname);

var config = {
  version: pkg.version,
  webPort: 7001,
  enableCluster: false,
  debug: true, // if debug
  viewCache: false,
  sessionSecret: 'input your own sesson secret',
  sessionCookie: 'input your own session cookie',
  logdir: path.join(root, '.tmp', 'logs'),
// @mysql
  //mysql config
  mysql: {
    host: '127.0.0.1',
    port: 3306,
    user: '',
    password: '',
    database: 'test',
    connectionLimit: 5,
    multipleStatements: true
  },
// @end
// @redis
  //redis config
  redis: {
    server: ['127.0.0.1:6379']
  },
// @end
};

// load config/config.js, everything in config.js will cover the same key in index.js
var customConfig = path.join(root, 'config/config.js');
if (fs.existsSync(customConfig)) {
  var options = require(customConfig);
  for (var k in options) {
    config[k] = options[k];
  }
}

mkdirp.sync(config.logdir);

module.exports = config;
