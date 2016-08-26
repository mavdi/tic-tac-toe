'use strict';

var Promise = require('bluebird');
var uuid = require('node-uuid');
var gamesStorage = require('../service/gamesStorage.service');

function createAndJoin(id) {
    return gamesStorage.create(id).then(function () {
        return gamesStorage.join(id, id);
    }).then(function () {
        return id;
    });
}

function join(gameId, playerId) {
    return gamesStorage.join(gameId, playerId);
}

function leave(playerId) {
    var game;
    return gamesStorage.getByPlayer(playerId).then(function (_game) {
        game = _game;
        gamesStorage.leave(game.id, playerId);
    }).then(function () {
        if (!game.players.x && !game.players.y) {
            gamesStorage.remove(game.id);
        }
    });
}

module.exports = {
    createAndJoin: createAndJoin,
    join: join,
    leave: leave
};
