'use strict';

var Promise = require('bluebird');
var uuid = require('node-uuid');
var gamesStorage = require('../service/gamesStorage.service');

function create(id) {
    return gamesStorage.create(id).then(function () {
        return gamesStorage.join(id, id, 'x');

    });
}

function leave(id) {
    return gamesStorage.getByPlayer(id).then(function (game) {
        gamesStorage.leave(game.id, id);
    });

    //return gamesStorage.remove(id);
}

module.exports = {
    create: create,
    leave: leave
};
