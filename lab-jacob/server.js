'use strict';

// npm modules
const debug = require('debug')('note:server');
const express = require('express');

// app modules
const deityRouter = require('./route/deity-router');

// globals
const port = process.env.PORT || 3000;
const app = express();

app.use('/api/deity', deityRouter);

app.all('*', function(req, res) { // sends a 404 for all routes when app.use fails
  debug('* 404');
  res.status(404).send('not found');
});

const server = app.listen(port, function(){
  debug('* 404');
  console.log('server up on port:', port);
});

module.exports = server;
server.isRunning = true;
