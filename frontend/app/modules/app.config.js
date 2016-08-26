(function () {
    'use strict';

    function config($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'modules/home/home.tpl.html'
        });
        $routeProvider.when('/game', {
            templateUrl: 'modules/game/game.tpl.html', controller: 'Game as game', reloadOnSearch: false
        });
        $routeProvider.otherwise({redirectTo: '/'});
    }

    angular.module('ticTacToe').config(['$routeProvider', config]);
})();
