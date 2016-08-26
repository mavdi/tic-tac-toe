(function () {
    'use strict';

    function playController($location, $routeParams, $scope, $timeout) {
        var socket = io.connect('http://localhost:3000');

        var id;

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
            ctrl.fields[y][x] = 'X';
            socket.emit('game:' + id, 'click');
        };

        socket.on('room:opponent:join', function () {
            ctrl.state = 'opponent-join';
            $scope.$apply();
            $timeout(function () {
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
