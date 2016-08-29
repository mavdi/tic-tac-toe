(function () {
    'use strict';

    function playController($location, $routeParams, $scope, $timeout) {
        var ctrl = this;
        var yourMark = 'o', opponentMark = 'o';


        function init() {
            ctrl.fields = [
                [], [], []
            ];
            ctrl.state = 'your-move';
        }


        function checkWinner(fields, x, y) {
            var i, win, mark = fields[y][x];
            win = mark;
            for (i = 0; i < 3; i++) {
                if (mark !== fields[i][x]) {
                    win = false;
                }
            }
            if (win) {
                return win;
            }
            win = mark;
            for (i = 0; i < 3; i++) {
                if (mark !== fields[y][i]) {
                    win = false;
                }
            }
            if (win) {
                return win;
            }
            win = mark;
            for (i = 0; i < 3; i++) {
                if (mark !== fields[2 - i][i]) {
                    win = false;
                }
            }
            if (win) {
                return win;
            }
            win = mark;
            for (i = 0; i < 3; i++) {
                if (mark !== fields[i][i]) {
                    win = false;
                }
            }

            return win;
        }

        function checkDraw(fields) {
            var count = 0;
            for (var j = 0; j < 3; j++) {
                for (var i = 0; i < 3; i++) {
                    if (fields[j][i]) {
                        count++;
                    }
                }
            }
            return 9 === count;
        }


        function botMove() {
            var winsMap = [];

            function createWinsMap(mark) {
                var fieldsCopy = angular.copy(ctrl.fields);
                var level = 0;
                var count = 0;
                var currentPath, currentPosition;
                winsMap = [];

                function findRecursively(mark) {
                    for (var j = 0; j < 3; j++) {
                        for (var i = 0; i < 3; i++) {
                            if (!fieldsCopy[j][i]) {
                                count++;
                                fieldsCopy[j][i] = mark;
                                if (!level) {
                                    currentPath = '' + i + j;
                                    currentPosition = {x: i, y: j};
                                }

                                if (checkWinner(fieldsCopy, i, j)) {
                                    winsMap[level] = winsMap[level] || {};
                                    winsMap[level][currentPath] = winsMap[level][currentPath] || {};
                                    winsMap[level][currentPath].wins = winsMap[level][currentPath].wins || 0;
                                    winsMap[level][currentPath].wins++;
                                    winsMap[level][currentPath].position = currentPosition;
                                    delete fieldsCopy[j][i];


                                } else {
                                    level++;
                                    findRecursively('x' === mark ? 'o' : 'x');
                                    level--;
                                    delete fieldsCopy[j][i];
                                }

                            }
                        }
                    }
                }

                findRecursively(mark);
            }


            //function findBestMove() {
            //
            //    return winsMap.shift().sort(function (a, b)
            //    {
            //        if (a.wins < b.wins) {
            //            return 1;
            //        }
            //        if (a.wins > b.wins) {
            //            return -1;
            //        }
            //        return 0;
            //    }).shift().position;
            //}

            createWinsMap('o');
            console.log(JSON.parse(JSON.stringify(winsMap)));
            createWinsMap('x');
            console.log(JSON.parse(JSON.stringify(winsMap)));
            winsMap = winsMap.filter(Boolean);
            //return findBestMove();
        }


        ctrl.move = function (x, y) {
            if ('your-move' !== ctrl.state || ctrl.fields[y][x]) {
                return;
            }
            ctrl.fields[y][x] = yourMark;
            console.log(botMove());
            //ctrl.state = 'opponent-move';
            if (checkWinner(ctrl.fields, x, y)) {
                ctrl.state = 'you-win';
            } else if (checkDraw(ctrl.fields)) {
                ctrl.state = 'draw';
            }
        };


        init();
    }

    angular.module('ticTacToe').controller('SingleplayerGame', ['$location', '$routeParams', '$scope', '$timeout', playController]);
})();
