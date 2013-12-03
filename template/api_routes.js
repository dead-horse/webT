// @restfulWrap
/*!
 * {{projectName}} - api_routes.js
 * Author: {{authName}} <{{authEmail}}>
 */

'use strict';

/**
 * Module dependencies.
 */

var test = require('./controllers/api/test');
var restfulWrap = require('restful-wrap');
var transformer = require('var-style');
// @logger
var logger = require('./common/logger');
// @end
var config = require('./config');

function apiRoutes(app) {
  var api = restfulWrap(app, {
    inputTransformer: transformer.snackToCamel,
    outputTransformer: transformer.camelToSnake
  });

  /**
   * Tests REST API
   *
   * GET /tests/now
   * [POST|PATCH|DELETE|PUT] /tests/mirror
   */
  api.get('/tests/now', test.now);
  api.post('/tests/mirror', test.mirror);
  api.patch('/tests/mirror', test.mirror);
  api.delete('/tests/mirror', test.mirror);
}

apiRoutes.notFound = restfulWrap.notFound();
apiRoutes.error = restfulWrap.error({
// @logger
  logger: logger,
// @end
  debug: config.debug
});

module.exports = apiRoutes;
