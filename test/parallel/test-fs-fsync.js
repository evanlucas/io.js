'use strict';
var common = require('../common');
var assert = require('assert');

var path = require('path');
var fs = require('fs');
var successes = 0;

var file = path.join(common.fixturesDir, 'a.js');

console.error('open ' + file);

fs.open(file, 'a', 0o777, function(err, fd) {
  console.error('fd ' + fd);
  if (err) throw err;

  fs.fdatasyncSync(fd);
  console.error('fdatasync SYNC: ok');
  successes++;

  fs.fsyncSync(fd);
  console.error('fsync SYNC: ok');
  successes++;

  fs.fdatasync(fd, function(err) {
    if (err) throw err;
    console.error('fdatasync ASYNC: ok');
    successes++;
    fs.fsync(fd, function(err) {
      if (err) throw err;
      console.error('fsync ASYNC: ok');
      successes++;
    });
  });
});

process.on('exit', function() {
  assert.equal(4, successes);
});
