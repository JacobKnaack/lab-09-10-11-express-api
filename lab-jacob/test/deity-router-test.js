'use strict';

// npm constants
const expect = require('chai').expect;
const request = require('superagent');

// app constants
const server = require('../server');
const storage = require('../lib/storage');
const Deity = require('../model/deity');

// globals
const port = process.env.PORT || 3000;
const homeUrl = `localhost:${port}/api/deity`;

describe('testing the router module', function(){
  before((done) => {
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

  after((done) => {
    if (server.isRunning){
      server.close(() =>{
        console.log('server is closed');
        done();
      });
      return;
    }
    done();
  });

  describe('testing post endpoint', function() {
    after ((done) => {
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

  describe('testing the get endpoint', function(){
    before((done) => {
      this.tempDeity = new Deity('testorpheus', 'testibolts');
      storage.setItem('deity', this.tempDeity);
      done();
    });

    after((done) => {
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
});
