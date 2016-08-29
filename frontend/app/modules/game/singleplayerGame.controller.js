(function () {
    'use strict';

    function playController($location, $routeParams, $scope, $timeout) {
        var ctrl = this;
        var yourMark = 'x', opponentMark = 'o';


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
                var currentPath, currentPosition;

                function findRecursively(mark) {
                    for (var j = 0; j < 3; j++) {
                        for (var i = 0; i < 3; i++) {
                            if (!fieldsCopy[j][i]) {
                                fieldsCopy[j][i] = mark;
                                if (!level) {
                                    currentPath = 'x:' + i + ' y:' + j;
                                    currentPosition = {x: i, y: j};
                                }

                                if (checkWinner(fieldsCopy, i, j)) {
                                    winsMap[level] = winsMap[level] || {};
                                    winsMap[level][currentPath] = winsMap[level][currentPath] || {};
                                    winsMap[level][currentPath].wins = winsMap[level][currentPath].wins || 0;
                                    winsMap[level][currentPath].wins++;
                                    winsMap[level][currentPath].position = currentPosition;

                                } else {
                                    level++;
                                    findRecursively('x' === mark ? 'o' : 'x');
                                    level--;
                                }
                                delete fieldsCopy[j][i];
                            }
                        }
                    }
                }

                findRecursively(mark);
            }

            function findBestMove() {
                var bestMove = {};
                angular.forEach(winsMap.shift(), function (move) {
                    if (!bestMove.wins || bestMove.wins < move.wins) {
                        bestMove = move;
                    }
                });
                return bestMove.position;
            }

            createWinsMap('o');
            createWinsMap('x');
            winsMap = winsMap.filter(Boolean);
            return findBestMove();
        }


        ctrl.move = function (x, y) {
            if ('your-move' !== ctrl.state || ctrl.fields[y][x]) {
                return;
            }
            ctrl.fields[y][x] = yourMark;
            if (checkWinner(ctrl.fields, x, y)) {
                ctrl.state = 'you-win';
                return;
            } else if (checkDraw(ctrl.fields)) {
                ctrl.state = 'draw';
                return;
            }
            var move = botMove();
            ctrl.fields[move.y][move.x] = opponentMark;
            if (checkWinner(ctrl.fields, move.x, move.y)) {
                ctrl.state = 'you-lose';
            } else if (checkDraw(ctrl.fields)) {
                ctrl.state = 'draw';
            }
        };


        init();
    }

    angular.module('ticTacToe').controller('SingleplayerGame', ['$location', '$routeParams', '$scope', '$timeout', playController]);
})();
