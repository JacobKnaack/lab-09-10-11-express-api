'use strict';

// npm modules
const Router = require('express').Router;
const deityRouter = module.exports = new Router();
const bodyParser = require('body-parser').json();
const debug = require('debug')('deity:deity-router');

// app modules
const storage = require('../lib/storage');
const Deity = require('../model/deity');

function createDeity(reqbody) { // creates a Deity abject and sets it with the storage module
  debug('createDeity');
  return new Promise(function(resolve, reject) {
    var deity;
    try {
      deity = new Deity(reqbody.name, reqbody.power);
    } catch (err) {
      return reject(err);
    }
    storage.setItem('deity', deity).then(function(deity) {
      resolve(deity);
    });
  });
}

deityRouter.post('/', bodyParser, function(req, res) { // route for POST method
  debug('hit post endpoint');
  createDeity(req.body).then(function(deity) {
    res.status(200).json(deity);
  }).catch(function(err) {
    console.error(err);
    res.sendError(err);
  });
});

deityRouter.get('/:id', function(req, res) { // route for GET method
  debug('hit get endpoint');
  storage.fetchItem('deity', req.params.id).then(function(deity) {
    res.status(200).json(deity);
  }).catch(function(err) {
    console.error(err.message);
    res.sendError(err);
  });
});

deityRouter.put('/:id', bodyParser, function(req, res){ // route for PUT method
  debug('hit put endpoint');
  storage.updateItem('deity', req.params.id, req.body).then(function(deity){
    res.status(200).json(deity);
  }).catch(function(err) {
    console.error(err.message);
    res.sendError(err);
  });
});

deityRouter.delete('/:id', function(req, res){ // route for DELETE method
  debug('hit delte route');
  storage.deleteItem('deity', req.params.id).then(function(deity){
    res.status(200).json(deity);
  }).catch(function(err){
    console.error(err.message);
    res.sendError(err);
  });
});
