(function () {
    'use strict';

    function playController($location, $routeParams, $scope) {
        var socket = io.connect('http://localhost:3000');

        var id;

        var ctrl = this;

        function init() {
            ctrl.fields = [
                [], [], []
            ];

            if ($routeParams.id) {
                socket.emit('room:join', $routeParams.id);
            } else {
                socket.emit('room:create');
                socket.on('room:create:response', function (data) {
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
            console.log('GAME STARTED !!!!!!!!!!');
        })

        socket.on('room:opponent:leave', function () {
            console.log('he left');
        })

        $scope.$on('$destroy', function () {
            socket.disconnect();
        });

        init();
    }

    angular.module('ticTacToe').controller('Game', ['$location', '$routeParams', '$scope', playController]);
})();
