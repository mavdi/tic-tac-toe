'use strict';

var games = {};
var _ = require('lodash');
var Promise = require('bluebird');

function create(id) {
    games[id] = {
        id: id, players: {}
    };
    return Promise.resolve();
}

function get(id) {
    if (games[id]) {
        return Promise.resolve(games[id]);
    } else {
        return Promise.reject();
    }
}

function getByPlayer(id) {
    var game;
    _.forEach(games, function (_game) {
        if (id === _game.players.x || id === _game.players.y) {
            game = _game;
        }
    });
    if (game) {
        return Promise.resolve(game);
    } else {
        return Promise.reject();
    }
}

function join(gameId, playerId, mark) {
    if (games[gameId]) {
        games[gameId].players[mark] = playerId;
        return Promise.resolve();
    } else {
        return Promise.reject();
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
        return Promise.reject();
    }
}

function remove(id) {
    delete games[id];
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


