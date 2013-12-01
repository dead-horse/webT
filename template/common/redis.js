@redis
/*!
 * {{projectName}} - common/mysql.js
 * Author: {{authName}} <{{AuthEmail}}>
 */

'use strict';

/**
 * Module dependencies.
 */

var mredis = require('mredis');
var config = require('../config');

var redis = mredis.createClient(config.redis);

redis.on("mredisError", function(err){
  console.error("find error: ", err.message);
});

exports = module.exports = redis;
