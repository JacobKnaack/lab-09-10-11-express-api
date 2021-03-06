'use strict';

// npm constants
const expect = require('chai').expect;
const request = require('superagent');

// app modules
const server = require('../server');
const storage = require('../lib/storage');
const Deity = require('../model/deity');

// globals
const port = process.env.PORT || 3000;
const homeUrl = `localhost:${port}/api/deity`;

describe('testing the router module', function(){
  before((done) => { // turns on the server for testing
    if (!server.isRunning){
      server.listen(port, () => {
        server.isRunning = true;
        console.log('server is up!:::', port);
        done();
      });
      return;
    }
    done();
  });

  after((done) => { // turns off the server when testing is done
    if (server.isRunning){
      server.close(() =>{
        server.isRunning = false;
        console.log('server is closed');
        done();
      });
      return;
    }
    done();
  });

  describe('testing post on /api/deity', function() { // testing the POST meethods*****************
    describe('testing a successful POST', function(){
      after ((done) => { // deletes the storage pool after test ceration
        storage.pool = {};
        done();
      });

      it ('should return a deity', function(done){
        request.post(homeUrl)
        .send({name: 'testytesterson', power: 'tests the shit out of everything'})
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('testytesterson');
          expect(!!res.body.id);
          done();
        });
      });
    });

    describe('testing bad request for POST', function() {
      it('should return a 400', function(done){
        request.post(homeUrl)
        .send({})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('bad request');
          done();
        });
      });
    });
  });

  describe('testing the GET on /api/deity', function(){ // testing the GET methods****************
    describe('testing a successful GET', function() {
      before((done) => { // creates a temporary deity for testing
        this.tempDeity = new Deity('testorpheus', 'testibolts!!');
        storage.setItem('deity', this.tempDeity);
        done();
      });

      after((done) => { // deletes deity when tests finish
        storage.pool = {};
        done();
      });

      it('should return a Deity', (done) => {
        request.get(`${homeUrl}/${this.tempDeity.id}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(this.tempDeity.name);
          expect(res.body.id).to.equal(this.tempDeity.id);
          done();
        });
      });
    });

    describe('testing not found GET request', () => {
      before((done) => {
        this.tempDeity = new Deity('testorpheus', 'testibolts!!');
        storage.setItem('deity', this.tempDeity);
        done();
      });

      after((done) => {
        storage.pool = {};
        done();
      });

      it('should return an error 404', (done) => {
        request.get(`${homeUrl}/`)
        .query({id: 1235766879648972634})
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.text).to.equal('not found');
          done();
        });
      });
    });

    describe('testing a bad request GET request', () => {
      before((done) => {
        this.tempDeity = new Deity('testorpheus', 'testibolts!!');
        storage.setItem('deity', this.tempDeity);
        done();
      });

      after((done) => {
        storage.pool = {};
        done();
      });

      it('should return an error 400', (done) => {
        request.get(`${homeUrl}/${{}}`)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('bad request');
          done();
        });
      });
    });
  });


  describe('testing the put on /api/deity', function(){ // testing the PUT methods*************
    describe('testing successful PUT', function(){
      before((done) => {
        this.tempDeity = new Deity('testiface', 'spaghetti fingers!');
        storage.setItem('deity', this.tempDeity);
        done();
      });

      after((done) => {
        storage.pool = {};
        done();
      });

      it('should return an updated Deity', (done) => {
        request.put(`${homeUrl}/${this.tempDeity.id}`)
        .send({power: 'testing put methods'})
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.power).to.equal('testing put methods');
          done();
        });
      });

      describe('testing bad put request', () => {
        it('should return a bad request', (done) => {
          request.put(`${homeUrl}/${{}}`)
          .send({power: 'some power'})
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body.power).to.equal(undefined);
            done();
          });
        });
      });
    });
  });
});
