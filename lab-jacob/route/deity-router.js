'use strict';

// npm module
const Router = require('express').Router;
const bodyParser = require('body-parser').json();
const debug = require('debug')('note:deity-router');

// app modules
const deityRouter = module.exports = new Router();
const AppError = require('../lib/app-error');
const storage = require('../lib/storage');
const Deity = require('../model/deity');

function createDeity(reqbody) {
  debug('createDeity');
  return new Promise(function(resolve, reject) {
    var deity;
    try {
      deity = new Deity(reqbody.name, reqbody.power);
    } catch (err) {
      reject(err);
    }
    storage.setItem('deity', deity).then(function(deity) {
      resolve(deity);
    }).catch(function(err) {
      reject(err);
    });
  });
}

deityRouter.post('/', bodyParser, function(req, res) {
  debug('hit post endpoint');
  createDeity(req.body).then(function(deity) {
    res.status(200).json(deity);
  }).catch(function(err) {
    console.error(err.message);
    if (AppError.isAppError(err)) {
      res.status(err.statusCode).send(err.responseMessage);
      return;
    }
    res.status(500).send('server error');
  });
});

deityRouter.get('/:id', function(req, res) {
  debug('hit get endpoint');
  storage.fetchItem('deity', req.params.id).then(function(deity) {
    res.status(200).json(deity);
  }).catch(function(err) {
    console.error(err.message);
    if (AppError.isAppError(err)) {
      res.status(err.statusCode).send(err.responseMessage);
      return;
    }
    res.status(500).send('server error');
  });
});

deityRouter.put('/', bodyParser, function(req, res){
  debug('hit put endpoint');
  storage.updateItem('deity', req.params.id).then(function(deity){
    res.status(200).json(deity);
  }).catch(function(err) {
    console.error(err.message);
    if (AppError.isAppError(err)) {
      res.status(err.statusCode).send(err.responseMessage);
    }
    res.status(500).send('server error');
  });
});

deityRouter.delete('/:id', function(req, res){
  debug('hit delte route');
  storage.deleteItem('deity', req.params.id).then(function(deity){
    res.status(200).json(deity);
  }).catch(function(err){
    console.error(err.message);
    if (AppError.isAppError(err)) {
      res.status(err.statusCode).send(err.responseMessage);
    }
    res.status(500).send('server error');
  });
});
