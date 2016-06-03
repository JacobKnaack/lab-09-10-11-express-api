'use strict';

const uuid = require('node-uuid');
const debug = require('debug');
const AppError = require('../lib/app-error');

module.exports = function(name, power){ // our dope ass deity constructor
  debug('inside deity constructor');
  if (!name || !power) throw AppError.error400('error: deity requires a name and a power');
  this.id = uuid.v1();
  this.name = name;
  this.power = power;
};
