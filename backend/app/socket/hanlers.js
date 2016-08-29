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
                socket.emit('room:join:response', result.player2Mark);
                io.to('/#' + result.player1Id).emit('room:opponent:join', result.player1Mark);
            });
        });

        socket.on('disconnect', function () {
            roomManager.leave(id).then(function (result) {
                io.to('/#' + result).emit('room:opponent:leave');
            });
        });

        socket.on('game:move:x', function (data) {
            roomManager.get(data.id).then(function (result) {
                io.to('/#' + result.players.o).emit('game:moved', data);
            });
        });

        socket.on('game:move:o', function (data) {
            roomManager.get(data.id).then(function (result) {
                io.to('/#' + result.players.x).emit('game:moved', data);
            });
        });

        socket.on('game:restart:x', function (data) {
            roomManager.get(data).then(function (result) {
                io.to('/#' + result.players.o).emit('game:restarted');
            });
        });

        socket.on('game:restart:o', function (data) {
            roomManager.get(data).then(function (result) {
                io.to('/#' + result.players.x).emit('game:restarted');
            });
        });


    });
};
