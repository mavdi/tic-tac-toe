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
            return game.players.x;
        } else if (game.players.y && playerId !== game.players.y) {
            return game.players.y;
        }
    });
}

function leave(playerId) {
    var game;
    return gamesStorage.getByPlayer(playerId).then(function (_game) {
        game = _game;
        return gamesStorage.leave(game.id, playerId);
    }).then(function () {
        if (!game.players.x && !game.players.y) {
            return gamesStorage.remove(game.id);
        } else if (game.players.x && playerId !== game.players.x) {
            return game.players.x;
        } else if (game.players.y && playerId !== game.players.y) {
            return game.players.y;
        }
    });
}

module.exports = {
    createAndJoin: createAndJoin,
    get: get,
    join: join,
    leave: leave
};
