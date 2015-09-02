'use strict';
var common = require('../common');
var assert = require('assert');
var net = require('net');
var gotError = false;

var server = net.createServer(function(socket) {
});
server.listen(common.PORT, assert.fail);
server.on('error', assert.fail);
server.close();
