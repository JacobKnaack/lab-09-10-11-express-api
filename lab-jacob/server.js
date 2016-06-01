'use strict';

// npm modules
const debug = require('debug')('deity:server');
const express = require('express');
const morgan = require('morgan');

// app modules
const deityRouter = require('./route/deity-router');
const errorResponse = require('./lib/error-response');

// globals
const port = process.env.PORT || 3000;
const app = express();

app.use('/api/deity', deityRouter); // specifies a router to use with my crud routes
app.use('/api/deity', morgan);
app.use(errorResponse);

app.all('*', function(req, res) { // sends a 404 for all routes/methods when app.use fails
  debug('* 404');
  res.status(404).send('not found');
});

const server = app.listen(port, function(){
  debug('* 404');
  console.log('server up on port:', port);
});

module.exports = server;
server.isRunning = true;
