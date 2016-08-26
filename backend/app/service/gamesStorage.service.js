'use strict';

var games = {};
var _ = require('lodash');
var Promise = require('bluebird');

function create(gameId) {
    games[gameId] = {
        id: gameId, players: {}
    };
    return Promise.resolve(games[gameId]);
}

function get(gameId) {
    if (games[gameId]) {
        return Promise.resolve(games[gameId]);
    } else {
        return Promise.reject('GAME_NOT_EXIST');
    }
}

function getByPlayer(playerId) {
    var game;
    _.forEach(games, function (_game) {
        if (playerId === _game.players.x || playerId === _game.players.y) {
            game = _game;
        }
    });
    if (game) {
        return Promise.resolve(game);
    } else {
        return Promise.reject('GAME_WITH_PLAYER_NOT_EXIST');
    }
}

function join(gameId, playerId) {
    if (games[gameId]) {
        if (!games[gameId].players.x) {
            games[gameId].players.x = playerId;
        } else if (!games[gameId].players.y) {
            games[gameId].players.y = playerId;
        } else {
            return Promise.reject('GAME_SLOTS_BUSY');
        }
        return Promise.resolve(games[gameId]);
    } else {
        return Promise.reject('GAME_NOT_EXIST');
    }
}

function leave(gameId, playerId) {
    if (games[gameId]) {
        if (games[gameId].players.x === playerId) {
            delete games[gameId].players.x;
        } else if (games[gameId].players.y === playerId) {
            delete games[gameId].players.y;
        }
        return Promise.resolve();
    } else {
        return Promise.reject('GAME_NOT_EXIST');
    }
}

function remove(gameId) {
    delete games[gameId];
    return Promise.resolve();
}

module.exports = {
    create: create,
    get: get,
    getByPlayer: getByPlayer,
    join: join,
    leave: leave,
    remove: remove
};


