(function () {
    'use strict';

    function playController($location, $routeParams, $scope, $timeout) {
        var socket = io.connect('http://localhost:3000');

        var mark;

        var ctrl = this;

        function init() {
            ctrl.fields = [
                [], [], []
            ];

            if ($routeParams.id) {
                socket.emit('room:join', $routeParams.id);
                socket.on('room:join:response', function () {
                    ctrl.state = 'opponent-join';
                    $scope.$apply();
                    $timeout(function () {
                        mark = 'o';
                        ctrl.state = 'opponent-move';
                    }, 3000);

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

        ctrl.click = function (x, y) {
            ctrl.fields[y][x] = mark && mark.toUpperCase();
            socket.emit('game:move:' + mark, {x: x, y: y});
            socket.on('game:move:' + mark + ':response', function (data) {
                console.log(data);
            });
        };

        socket.on('room:opponent:join', function () {
            ctrl.state = 'opponent-join';
            $scope.$apply();
            $timeout(function () {
                mark = 'x';
                ctrl.state = 'your-move';
            }, 3000);
        });

        socket.on('room:opponent:leave', function () {
            ctrl.state = 'opponent-leave';
            $scope.$apply();
        });

        $scope.$on('$destroy', function () {
            socket.disconnect();
        });

        init();
    }

    angular.module('ticTacToe').controller('Game', ['$location', '$routeParams', '$scope', '$timeout', playController]);
})();
