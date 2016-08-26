(function () {
    'use strict';

    function config($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'modules/home/home.tpl.html'
        });
        $routeProvider.when('/multiplayer', {
            templateUrl: 'modules/game/game.tpl.html',
            controller: 'MultiplayerGame as multiplayerGame',
            reloadOnSearch: false
        });
        $routeProvider.otherwise({redirectTo: '/'});
    }

    angular.module('ticTacToe').config(['$routeProvider', config]);
})();
