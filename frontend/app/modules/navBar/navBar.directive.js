(function () {
    'use strict';

    function NavBarController($location, $scope) {
        var ctrl = this;

        ctrl.select = function (option) {
            ctrl.currentState = option;
            $location.path('/play');
        };

        $scope.$on('$routeChangeSuccess', function (event, currentRoute) {
            if (-1 === currentRoute.$$route.originalPath.indexOf(ctrl.currentState)) {
                ctrl.currentState = '';
            }
        });
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
