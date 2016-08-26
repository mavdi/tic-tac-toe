(function () {
    'use strict';

    function playController($location, $routeParams, $scope, $timeout) {
        var ctrl = this;
        var yourMark, opponentMark;
        var socket = io.connect('http://localhost:3000');

        function init() {
            ctrl.fields = [
                [], [], []
            ];

            if ($routeParams.id) {
                socket.emit('room:join', $routeParams.id);
                socket.on('room:join:response', function (data) {
                    startGame(data, true);
                });
            } else {
                socket.emit('room:create');
                socket.on('room:create:response', function (data) {
                    ctrl.state = 'waiting';
                    $location.search({id: data.id});
                    $scope.$apply();
                });
            }
        }

        function startGame(marker, scopeApply) {
            ctrl.fields = [
                [], [], []
            ];
            ctrl.state = 'game-start';
            if (scopeApply) {
                $scope.$apply();
            }
            $timeout(function () {
                yourMark = marker;
                opponentMark = 'x' === marker ? 'o' : 'x';
                ctrl.state = 'x' === marker ? 'your-move' : 'opponent-move';
            }, 2000);
        }

        function checkWinner(x, y) {
            var i, win = true, mark = ctrl.fields[y][x];
            for (i = 0; i < 3; i++) {
                if (mark !== ctrl.fields[i][x]) {
                    win = false;
                }
            }
            if (win) {
                return true;
            }
            win = true;
            for (i = 0; i < 3; i++) {
                if (mark !== ctrl.fields[y][i]) {
                    win = false;
                }
            }
            if (win) {
                return true;
            }
            win = true;
            for (i = 0; i < 3; i++) {
                if (mark !== ctrl.fields[2 - i][i]) {
                    win = false;
                }
            }
            if (win) {
                return true;
            }
            win = true;
            for (i = 0; i < 3; i++) {
                if (mark !== ctrl.fields[i][2 - i]) {
                    win = false;
                }
            }
            return win;
        }

        ctrl.move = function (x, y) {
            if ('your-move' !== ctrl.state || ctrl.fields[y][x]) {
                return;
            }
            ctrl.fields[y][x] = yourMark && yourMark.toUpperCase();
            ctrl.state = 'opponent-move';
            if (checkWinner(x, y)) {
                ctrl.state = 'you-win';
            }
            socket.emit('game:move:' + yourMark, {
                id: $routeParams.id,
                x: x,
                y: y
            });
        };

        ctrl.restart = function () {
            startGame(yourMark);
            socket.emit('game:restart:' + yourMark, $routeParams.id);
        };

        socket.on('room:opponent:join', function (data) {
            startGame(data, true);
        });

        socket.on('room:opponent:leave', function () {
            ctrl.state = 'opponent-leave';
            $scope.$apply();
        });

        socket.on('game:moved', function (data) {
            ctrl.state = 'your-move';
            ctrl.fields[data.y][data.x] = opponentMark && opponentMark.toUpperCase();
            if (checkWinner(data.x, data.y)) {
                ctrl.state = 'you-lose';
            }
            $scope.$apply();
        });

        socket.on('game:restarted', function () {
            startGame(yourMark, true);
        });

        $scope.$on('$destroy', function () {
            socket.disconnect();
        });

        init();
    }

    angular.module('ticTacToe').controller('Game', ['$location', '$routeParams', '$scope', '$timeout', playController]);
})();
