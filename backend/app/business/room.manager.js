'use strict';

var gamesStorage = require('../service/gamesStorage.service');

function createAndJoin(id) {
    return gamesStorage.create(id).then(function () {
        return gamesStorage.join(id, id);
    });
}

function get(id) {
    return gamesStorage.get(id);
}

function join(gameId, playerId) {
    return gamesStorage.join(gameId, playerId).then(function (game) {
        if (game.players.x && playerId !== game.players.x) {
            return {
                player1Id: game.players.x,
                player1Mark: 'x',
                player2Mark: 'o'
            };
        } else if (game.players.o && playerId !== game.players.o) {
            return {
                player1Id: game.players.o,
                player1Mark: 'o',
                player2Mark: 'x'
            };
        }

    });
}

function leave(playerId) {
    var game;
    return gamesStorage.getByPlayer(playerId).then(function (_game) {
        game = _game;
        return gamesStorage.leave(game.id, playerId);
    }).then(function () {
        if (!game.players.x && !game.players.o) {
            return gamesStorage.remove(game.id);
        } else if (game.players.x && playerId !== game.players.x) {
            return game.players.x;
        } else if (game.players.o && playerId !== game.players.o) {
            return game.players.o;
        }
    });
}

module.exports = {
    createAndJoin: createAndJoin,
    get: get,
    join: join,
    leave: leave
};
