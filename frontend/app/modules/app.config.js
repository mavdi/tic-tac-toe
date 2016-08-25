(function () {
    'use strict';

    function config($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'modules/home/home.tpl.html'
        });
        $routeProvider.when('/play', {
            templateUrl: 'modules/play/play.tpl.html', controller: 'Play as play'
        });
        $routeProvider.otherwise({redirectTo: '/'});
    }

    angular.module('ticTacToe').config(['$routeProvider', config]);
})();
