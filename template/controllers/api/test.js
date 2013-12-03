// @restfulWrap
/*!
 * {{projectName}} - controllers/api/test.js
 * Copyright(c) 2013 
 * Author: {{authName}} <{{authEmail}}>
 */

'use strict';

/**
 * Module dependencies.
 */

var verifyParams = require('../common').verifyParams;

exports.now = function (params, callback) {
  callback(null, new Date());
};

/**
 * mirror test
 * @param {Object} params
 *  - {Number} [status] return code
 *  - {Object|String|Number} [data] mock return data
 *  - {String} [message] mock return error message
 * @param {Function(err, result)} callback
 */
exports.mirror = verifyParams({
  status: { required: false, type: 'number' },
  message: { required: false, type: 'string' }
}, function (params, callback) {
  var status = params.status || 200;
  process.nextTick(function () {
    if (status !== 200) {
      var err = new Error(params.message || '/tests/mirror mock error');
      err.status = status;
      err.ignore = true;
      err.params = params;
      err.errors = params.errors;
      err.body = params.body;
      return callback(err);
    }
    callback(null, params);
  });
});
