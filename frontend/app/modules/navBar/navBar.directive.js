(function () {
    'use strict';

    function NavBarController($location, $scope) {
        var ctrl = this;
        var states = ['singleplayer', 'multiplayer'];

        function init() {
            angular.forEach(states, function (state) {
                if (-1 !== $location.url().indexOf(state)) {
                    ctrl.currentState = state;
                }
            });
        }

        ctrl.select = function (option) {
            ctrl.currentState = option;
            $location.path('/' + option).search({});
        };

        $scope.$on('$routeChangeSuccess', function (event, currentRoute) {
            if (!currentRoute.$$route || -1 === currentRoute.$$route.originalPath.indexOf(ctrl.currentState)) {
                ctrl.currentState = '';
            }
        });

        init();
    }

    function navBar() {
        return {
            restrict: 'E',
            controller: ['$location', '$scope', NavBarController],
            controllerAs: 'navBar',
            templateUrl: 'modules/navBar/navBar.tpl.html'
        };
    }

    angular.module('ticTacToe').directive('navBar', [navBar]);
})();
