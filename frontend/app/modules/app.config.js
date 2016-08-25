(function () {
    'use strict';


    angular.module('ticTacToe').config(function ($routeProvider) {

        $routeProvider.when('/', {
            templateUrl: 'modules/home/home.tpl.html'
        });
        $routeProvider.when('/play', {
            templateUrl: 'modules/play/play.tpl.html'
        });
        $routeProvider.otherwise({redirectTo: '/'});
    });

})();
