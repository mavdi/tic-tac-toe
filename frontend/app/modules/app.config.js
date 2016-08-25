(function () {
    'use strict';


    angular.module('ticTacToe').config(function ($routeProvider) {

        $routeProvider.when('/', {
            templateUrl: 'modules/play/play.tpl.html'
        });
        $routeProvider.otherwise({redirectTo: '/'});
    });

})();
