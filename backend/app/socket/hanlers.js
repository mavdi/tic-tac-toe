'use strict';

var roomManager = require('../business/room.manager');

module.exports = function (io) {
    io.on('connection', function (socket) {
        var id = socket.id.slice(2);

        socket.on('room:create', function () {
            roomManager.createAndJoin(id).then(function (result) {
                socket.emit('room:create:response', result);
            });
        });

        socket.on('room:join', function (data) {
            roomManager.join(data, id).then(function (result) {
                socket.emit('room:join:response');
                io.to('/#' + result).emit('room:opponent:join');
            });
        });

        socket.on('disconnect', function () {
            roomManager.leave(id).then(function (result) {
                io.to('/#' + result).emit('room:opponent:leave');
            });
        });

        socket.on('game:move:x', function (data) {
            console.log(data);
        });

        socket.on('game:move:o', function (data) {
            console.log(data);
        });


    });
};
