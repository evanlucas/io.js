'use strict';
var common = require('../common');
var assert = require('assert');
var path = require('path');
var fs = require('fs');
var got_error = false;

var filename = path.join(common.fixturesDir, 'does_not_exist.txt');
fs.readFile(filename, 'raw', function(err, content) {
  if (err) {
    got_error = true;
  } else {
    assert.fail('cat returned some content: ' + content);
  }
});

process.on('exit', function() {
  console.log('done');
  assert.equal(true, got_error);
});
