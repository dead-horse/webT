// @redis
/*!
 * {{projectName}} - common/mysql.js
 * Copyright(c) 2013 
 * Author: {{authName}} <{{AuthEmail}}>
 */

'use strict';

/**
 * Module dependencies.
 */

var mredis = require('mredis');
var config = require('../config');
// @logger
var logger = require('./logger');
// @end

var redis = mredis.createClient(config.redis);

redis.on("mredisError", function(err){
  console.error('find error: %s', err.message);
// @logger
  logger.error('find error: %s', err.message);
// @end
});

exports = module.exports = redis;
