'use strict';

const debug = require('debug')('note:app-error');

const AppError = module.exports = function(statusCode, message,  responseMessage) {
  debug('app-error');
  Error.call(this);
  this.statusCode = statusCode;
  this.message = message;
  this.responseMessage = responseMessage;
};

AppError.prototype = Object.create(Error.prototype);

AppError.isAppError = function(err) {
  debug('apperror');
  return err instanceof AppError;
};

AppError.error404 = function(message){
  debug('error404');
  return new AppError(message, 404, 'not found');
};

AppError.error400 = function(message){
  debug('error400');
  return new AppError(message, 400, 'bad request');
};

AppError.error500 = function(message){
  debug('error500');
  return new AppError(message, 500, 'server error');
};
