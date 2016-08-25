(function () {
    'use strict';

    function playController() {
        var socket = io.connect('http://localhost:3000');

        var id;

        var ctrl = this;

        ctrl.fields = [
            [], [], []
        ];

        ctrl.click = function (x, y) {
            ctrl.fields[y][x] = 'X';
            socket.emit('game:' + id, 'click');

        };

        socket.emit('room:create');

        socket.on('room:create:response', function (data) {
            console.log(data);
            id = data;
        });
    }

    angular.module('ticTacToe').controller('Game', [playController]);
})();
