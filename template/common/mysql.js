// @mysql
/*!
 * {{projectName}} - common/mysql.js
 * Copyright(c) 2013 
 * Author: {{authName}} <{{authEmail}}>
 */

'use strict';

/**
 * Module dependencies.
 */

var config = require('../config');
var mysql = require('mysql');

// TODO: query timeout
var pool = exports.pool = mysql.createPool(config.mysql);

exports.query = function (sql, values, cb) {
  pool.query(sql, values, cb);
};

exports.queryOne = function (sql, values, cb) {
  if (typeof values === 'function') {
    cb = values;
    values = null;
  }
  exports.query(sql, values, function (err, rows) {
    if (rows) {
      rows = rows[0];
    }
    cb(err, rows);
  });
};
