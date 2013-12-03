// @restfulWrap
/*!
 * {{projectName}} - test/controllers/api/test.test.js 
 * Copyright(c) 2013 
 * Author: {{authName}} <{{authEmail}}>
 */

'use strict';

/**
 * Module dependencies.
 */


var app = require('../../../app');
var should = require('should');
var request = require('supertest');
var pedding = require('pedding');

describe('controllers/test.test.js', function () {

  before(function (done) {
    app.listen(0, done);
  });

  describe('/tests/mirror', function () {
    it('should return mirror datas', function (done) {
      var expect = {status: 200, foo: 'bar', no: 1, now: new Date()};
      done = pedding(3, done);

      request(app)
      .post('/api/tests/mirror')
      .send(expect)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, function (err, res) {
        should.not.exists(err);
        res.body.now = new Date(res.body.now);
        res.body.should.eql(expect);
        done();
      });

      var expect2 = {foo: 'bar', no: 1, now: new Date()};
      request(app)
      .patch('/api/tests/mirror')
      .send(expect2)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, function (err, res) {
        should.not.exists(err);
        res.body.now = new Date(res.body.now);
        res.body.should.eql(expect2);
        done();
      });

      request(app)
      .del('/api/tests/mirror')
      .send(expect)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, function (err, res) {
        should.not.exists(err);
        res.body.now = new Date(res.body.now);
        res.body.should.eql(expect);
        done();
      });   
    });

    it('should 422 when status is not number', function (done) {
      var expect = {status: '200', foo: 'bar', no: 1};
      request(app)
      .post('/api/tests/mirror')
      .send(expect)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(422)
      .expect({ 
        message: 'Validation Failed',
        errors: 
         [ { resource: 'Param',
             field: 'status',
             message: 'expect number, but got string',
             code: 'invalid' } ],
        params: 
         { status: '200',
           foo: 'bar',
           no: 1 } }, done);
    });

    it('should 422 when message is not string', function (done) {
      var expect = {status: 500, message: 123};
      request(app)
      .post('/api/tests/mirror')
      .send(expect)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(422)
      .expect({ 
        message: 'Validation Failed',
        errors: 
         [ { resource: 'Param',
             field: 'message',
             message: 'expect string, but got number',
             code: 'invalid' } ],
        params: 
         { status: 500,
           message: 123 } }, done);
    });

    it('should 404 when method === GET', function (done) {
      var expect = {status: 200, foo: 'bar', no: 1, now: new Date()};
      request(app)
      .get('/api/tests/mirror')
      .send(expect)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(404)
      .expect({message: 'GET /api/tests/mirror Not Found'}, done);
    });

    it('should return error when status !== 200', function (done) {
      done = pedding(3, done);
      var expect = {status: 400, foo: 'bar', no: 1, now: new Date()};
      request(app)
      .post('/api/tests/mirror')
      .send(expect)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(400, function (err, res) {
        should.not.exists(err);
        res.body.params.now = new Date(res.body.params.now);
        res.body.params.should.eql(expect);
        res.body.should.not.have.property('errors');
        res.body.message.should.equal('/tests/mirror mock error');
        done();
      });

      var expect2 = {status: 500, message: 'test mirror mock error api'};
      request(app)
      .post('/api/tests/mirror')
      .send(expect2)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(500, function (err, res) {
        should.not.exists(err);
        res.body.should.not.have.property('errors');
        res.body.params.should.eql(expect2);
        res.body.message.should.equal('test mirror mock error api');
        done();
      });

      var expect3 = {
        status: 422, 
        message: 'Validation Failed', 
        errors: [{
           "resource": "Notice",
           "field": "email",
           "code": "missing_field"
        }]
      };
      request(app)
      .patch('/api/tests/mirror')
      .send(expect3)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(422, function (err, res) {
        should.not.exists(err);
        res.body.errors.should.eql(expect3.errors);
        res.body.params.should.eql(expect3);
        res.body.message.should.equal('Validation Failed');
        done();
      });
    });
  });
});
