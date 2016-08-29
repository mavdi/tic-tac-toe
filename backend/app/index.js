'use strict';

var express = require('express');
var http = require('http');
var socketIo = require('socket.io');


var app = express();
app.use(express.static(__dirname + '/../../frontend/app'));

var server = http.Server(app);
var io = socketIo(server);

server.listen(3000, function () {
    console.info('Http server listening on port', 3000);
});

require('./socket/hanlers')(io);


