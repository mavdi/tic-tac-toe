(function () {
    'use strict';

    function playController(GameState) {
        var ctrl = this;
        var yourMark = 'x', opponentMark = 'o';


        function init() {
            ctrl.fields = [
                [], [], []
            ];
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

                                if (GameState.checkWinner(fieldsCopy, i, j)) {
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
                function findInMap() {
                    var bestMove = {};
                    angular.forEach(winsMap.shift(), function (move) {
                        if (!bestMove.wins || bestMove.wins < move.wins) {
                            bestMove = move;
                        }
                    });
                    return bestMove.position;
                }

                function findAnyMove() {
                    for (var j = 0; j < 3; j++) {
                        for (var i = 0; i < 3; i++) {
                            if (!ctrl.fields[j][i]) {
                                return {x: i, y: j};
                            }
                        }
                    }
                }

                if (winsMap.length) {
                    return findInMap();
                } else {
                    return findAnyMove();
                }
            }

            createWinsMap('o');
            createWinsMap('x');
            winsMap = winsMap.filter(Boolean);
            return findBestMove();
        }


        ctrl.move = function (x, y) {
            if (ctrl.fields[y][x] || ctrl.isRestartVisible()) {
                return;
            }
            ctrl.fields[y][x] = yourMark;
            if (GameState.checkWinner(ctrl.fields, x, y)) {
                ctrl.state = 'you-win';
                return;
            } else if (GameState.checkDraw(ctrl.fields)) {
                ctrl.state = 'draw';
                return;
            }
            var move = botMove();
            ctrl.fields[move.y][move.x] = opponentMark;
            if (GameState.checkWinner(ctrl.fields, move.x, move.y)) {
                ctrl.state = 'you-lose';
            } else if (GameState.checkDraw(ctrl.fields)) {
                ctrl.state = 'draw';
            }
        };

        ctrl.restart = function () {
            ctrl.state = '';
            init();
        };

        ctrl.isRestartVisible = function () {
            return 'you-win' === ctrl.state || 'you-lose' === ctrl.state || 'draw' === ctrl.state;
        };


        init();
    }

    angular.module('ticTacToe').controller('SingleplayerGame', ['GameState', playController]);
})();
