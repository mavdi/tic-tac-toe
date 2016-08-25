(function () {
    'use strict';

    function playController() {
        var socket = io.connect('http://localhost:3000');

        var ctrl = this;

        ctrl.fields = [
            [], [], []
        ];

        ctrl.click = function (x, y) {
            ctrl.fields[y][x] = 'X';
            socket.emit('move:x', {x: x, y: y});
        };


        socket.on('news', function (data) {
            console.log(data);
        });
    }

    angular.module('ticTacToe').controller('Play', [playController]);
})();
