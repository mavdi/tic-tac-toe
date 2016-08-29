'use strict';

var express = require('express');
var http = require('http');
var socketIo = require('socket.io');
var config = require('./config');


var app = express();
app.use(express.static(__dirname + '/../../frontend/app'));

var server = http.Server(app);
var io = socketIo(server);

server.listen(config.port, function () {
    console.info('Http server listening on port', config.port);
});

require('./socket/hanlers')(io);


