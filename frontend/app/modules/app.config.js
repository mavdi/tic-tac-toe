(function () {
    'use strict';

    function config($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'modules/home/home.tpl.html'
        });
        $routeProvider.when('/singleplayer', {
            templateUrl: 'modules/game/game.tpl.html',
            controller: 'SingleplayerGame as game'
        });
        $routeProvider.when('/multiplayer', {
            templateUrl: 'modules/game/game.tpl.html',
            controller: 'MultiplayerGame as game',
            reloadOnSearch: false
        });
        $routeProvider.otherwise({redirectTo: '/'});
    }

    var socketIoUrl = 'localhost' === window.location.hostname ? 'localhost:3000' : window.location.hostname;

    angular.module('ticTacToe').config(['$routeProvider', config]);
    angular.module('ticTacToe').value('SocketIoUrl', socketIoUrl);
})();
