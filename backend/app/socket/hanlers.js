'use strict';

var roomManager = require('../business/room.manager');

module.exports = function (io) {
    io.on('connection', function (socket) {

        socket.on('room:create', function () {
            roomManager.create(socket.id).then(function () {
                socket.emit('room:create:response', socket.id);
            });
        });

        socket.on('game:' + socket.id, function (data) {
            console.log(data);
        });

        socket.on('disconnect', function () {
            roomManager.leave(socket.id);
        });


    });
};
