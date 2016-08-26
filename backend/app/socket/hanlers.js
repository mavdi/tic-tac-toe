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
                socket.emit('room:join:response', result);
            });
        });

        socket.on('game:' + id, function (data) {
            console.log(data);
        });

        socket.on('disconnect', function () {
            roomManager.leave(id);
        });


    });
};
