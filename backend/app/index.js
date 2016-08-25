'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var socketIo = require('socket.io');


var app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../../frontend/app'));

var server = http.Server(app);
var io = socketIo(server);

server.listen(3000, function () {
    console.info('Http server listening on port', 3000);
});

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    socket.emit('news', {hello: 'world'});
    socket.on('move:x', function (data) {
        console.log(data);
    });
});
