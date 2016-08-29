(function () {
    'use strict';

    function gameState() {
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

        return {
            checkWinner: checkWinner,
            checkDraw: checkDraw
        }
    }

    angular.module('ticTacToe').service('GameState', [gameState]);
})();
