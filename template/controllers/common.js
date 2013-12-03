// @restfulWrap
/*!
 * {{projectName}} - controllers/common.js
 * Copyright(c) 2013 
 * Author: {{authName}} <{{authEmail}}>
 */

'use strict';

/**
 * Module dependencies.
 */

var p = require('parameter');

/**
 * params rule check tool
 * @param {Object} rules 
 * {
 *   uid: {isId: true}, // isId   like '4321'
 *   date: {isDate: true}, // isDate like `YYYY-MM-DD` 
 *   limit: {type: 'number', required: false } // type check: 'number', 'string', 'object' or 'function'
 * }
 * @param {Function(params, callback, ...)} fn
 * @return {Function} wrap function
 */
exports.verifyParams = function (rules, fn) {
  return function verifyParamsHandle(params, callback) {
    var errors = p.verify(params, rules);
    if (errors) {
      var err = new Error('Validation Failed');
      err.name = 'ParameterError';
      err.status = 422;
      err.params = params;    
      err.errors = errors;
      return callback(err);
    }

    fn.apply(null, arguments);
  };
};
