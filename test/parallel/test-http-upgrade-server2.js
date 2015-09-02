'use strict';
var common = require('../common');
var assert = require('assert');
var http = require('http');
var net = require('net');

var server = http.createServer(function(req, res) {
  console.error('got req');
  throw new Error('This shouldn\'t happen.');
});

server.on('upgrade', function(req, socket, upgradeHead) {
  console.error('got upgrade event');
  // test that throwing an error from upgrade gets
  // is uncaught
  throw new Error('upgrade error');
});

var gotError = false;

process.on('uncaughtException', function(e) {
  console.error('got \'clientError\' event');
  assert.equal('upgrade error', e.message);
  gotError = true;
  process.exit(0);
});


server.listen(common.PORT, function() {
  var c = net.createConnection(common.PORT);

  c.on('connect', function() {
    console.error('client wrote message');
    c.write('GET /blah HTTP/1.1\r\n' +
            'Upgrade: WebSocket\r\n' +
            'Connection: Upgrade\r\n' +
            '\r\n\r\nhello world');
  });

  c.on('end', function() {
    c.end();
  });

  c.on('close', function() {
    console.error('client close');
    server.close();
  });
});

process.on('exit', function() {
  assert.ok(gotError);
});
