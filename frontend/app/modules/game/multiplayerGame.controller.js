(function () {
    'use strict';

    function playController($location, $routeParams, $scope, $timeout, GameState, SocketIoUrl) {
        var ctrl = this;
        var yourMark, opponentMark;
        var socket = io.connect(SocketIoUrl);

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

        ctrl.move = function (x, y) {
            if ('your-move' !== ctrl.state || ctrl.fields[y][x]) {
                return;
            }
            ctrl.fields[y][x] = yourMark && yourMark.toUpperCase();
            ctrl.state = 'opponent-move';
            if (GameState.checkWinner(ctrl.fields, x, y)) {
                ctrl.state = 'you-win';
            } else if (GameState.checkDraw(ctrl.fields)) {
                ctrl.state = 'draw';
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

        ctrl.isRestartVisible = function () {
            return 'you-win' === ctrl.state || 'you-lose' === ctrl.state || 'draw' === ctrl.state;
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
            if (GameState.checkWinner(ctrl.fields, data.x, data.y)) {
                ctrl.state = 'you-lose';
            } else if (GameState.checkDraw(ctrl.fields)) {
                ctrl.state = 'draw';
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

    angular.module('ticTacToe').controller('MultiplayerGame', ['$location', '$routeParams', '$scope', '$timeout', 'GameState', 'SocketIoUrl', playController]);
})();
