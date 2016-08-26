(function () {
    'use strict';

    function config($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'modules/home/home.tpl.html'
        });
        $routeProvider.when('/singleplayer', {
            templateUrl: 'modules/game/game.tpl.html',
            controller: 'SingleplayerGame as game',
            reloadOnSearch: false
        });
        $routeProvider.when('/multiplayer', {
            templateUrl: 'modules/game/game.tpl.html',
            controller: 'MultiplayerGame as game',
            reloadOnSearch: false
        });
        $routeProvider.otherwise({redirectTo: '/'});
    }

    angular.module('ticTacToe').config(['$routeProvider', config]);
})();
