'use strict';

const debug = require('debug')('deity:storage');
const AppError = require('./app-error');

exports.pool = {};

exports.setItem = function(schema, item) { // creates a resource and puts it in the resource pool
  debug('setItem');
  return new Promise((resolve, reject) => {
    if (!item.id) {
      var err = AppError.error400('storage setItem requires id');
      return reject(err);
    }
    if (!this.pool[schema]) this.pool[schema] = {};
    this.pool[schema][item.id] = item;
    resolve(item);
  });
};

exports.fetchItem = function(schema, id){ // fetches a resource from the pool
  debug('fetchItem');
  return new Promise((resolve, reject) => {
    if (!this.pool[schema]){
      var err = AppError.error404('storage schema not found');
      return reject(err);
    }
    if (!this.pool[schema][id]){
      if (this.pool[schema][id] === undefined){
        err = AppError.error400('bad GET request');
        return reject(err);
      }
      err = AppError.error404('storage schema not found');
      return reject(err);
    }
    resolve(this.pool[schema][id]);
  });
};

exports.updateItem = function(schema, id, updateContent){ // updates a resource item from the pool
  debug('inside update Item');
  return new Promise((resolve, reject) => {
    if (!this.pool[schema]) {
      var err = AppError.error400('bad PUT request');
      return reject(err);
    }
    if (!this.pool[schema][id]){
      err = AppError.error400('bad PUT request');
      return reject(err);
    }
    if(this.pool[schema][id].power) {
      this.pool[schema][id].power = updateContent.power;
    }
    if(this.pool[schema][id].name){
      this.pool[schema][id].name = updateContent.name;
    }
    resolve(this.pool[schema][id]);
  });
};

exports.deleteItem = function(schema, id){ // deltes a resource from the pool
  debug('deleteItem');
  return new Promise((resolve, reject) => {
    if (!this.pool[schema]){
      var err = AppError.error404('storage schema not found');
      return reject(err);
    }
    if (!this.pool[schema][id]){
      err = AppError.error404('storage item not found');
      return reject(err);
    }
    delete this.pool[schema][id];
    resolve(true);
  });
};
