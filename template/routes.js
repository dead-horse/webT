/*!
 * {{projectName}} - routes.js 
 * Copyright(c) 2013 
 * Author: {{authName}} <{{authEmail}}>
 */

'use strict';

/**
 * Module dependencies.
 */
var home = require('./controllers/home');

module.exports = function (app) {
  app.get('/', home);
};
