(function () {
    'use strict';

    function playController($location, $routeParams, $scope, $timeout) {
        var ctrl = this;
        var yourMark, opponentMark;
        var socket = io.connect('http://localhost:3000');

        function init() {
            resetFields();

            if ($routeParams.id) {
                socket.emit('room:join', $routeParams.id);
                socket.on('room:join:response', function () {
                    ctrl.state = 'game-start';
                    $scope.$apply();
                    $timeout(function () {
                        yourMark = 'o';
                        opponentMark = 'x';
                        ctrl.state = 'opponent-move';
                    }, 2000);

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

        function resetFields() {
            ctrl.fields = [
                [], [], []
            ];
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
            ctrl.state = 'opponent-move';
            resetFields();
            socket.emit('game:restart:' + yourMark, $routeParams.id);
        };

        socket.on('room:opponent:join', function () {
            ctrl.state = 'game-start';
            $scope.$apply();
            $timeout(function () {
                yourMark = 'x';
                opponentMark = 'o';
                ctrl.state = 'your-move';
            }, 2000);
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
            ctrl.state = 'your-move';
            resetFields();
            $scope.$apply();
        });

        $scope.$on('$destroy', function () {
            socket.disconnect();
        });

        init();
    }

    angular.module('ticTacToe').controller('Game', ['$location', '$routeParams', '$scope', '$timeout', playController]);
})();
