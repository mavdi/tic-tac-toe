(function () {
    'use strict';

    function playController($location, $routeParams, $scope, $timeout) {
        var ctrl = this;

        function init() {

        }


        init();
    }

    angular.module('ticTacToe').controller('SingleplayerGame', ['$location', '$routeParams', '$scope', '$timeout', playController]);
})();
