(function () {
    'use strict';

    function playController($routeParams) {
        var socket = io.connect('http://localhost:3000');

        var id;

        var ctrl = this;

        function init() {
            ctrl.fields = [
                [], [], []
            ];

            if ($routeParams.gameId) {
                socket.emit('room:join', $routeParams.gameId);
            } else {
                socket.emit('room:create');
                socket.on('room:create:response', function (data) {
                    id = data;
                });
            }
        }

        ctrl.click = function (x, y) {
            ctrl.fields[y][x] = 'X';
            socket.emit('game:' + id, 'click');
        };

        init();
    }

    angular.module('ticTacToe').controller('Game', ['$routeParams', playController]);
})();
