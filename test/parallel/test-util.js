'use strict';
var common = require('../common');
var assert = require('assert');
var util = require('util');
var context = require('vm').runInNewContext;

// sys
assert.deepEqual(require('sys'), util);

// isArray
assert.equal(true, util.isArray([]));
assert.equal(true, util.isArray(Array()));
assert.equal(true, util.isArray(new Array()));
assert.equal(true, util.isArray(new Array(5)));
assert.equal(true, util.isArray(new Array('with', 'some', 'entries')));
assert.equal(true, util.isArray(context('Array')()));
assert.equal(false, util.isArray({}));
assert.equal(false, util.isArray({ push: function() {} }));
assert.equal(false, util.isArray(/regexp/));
assert.equal(false, util.isArray(new Error()));
assert.equal(false, util.isArray(Object.create(Array.prototype)));

// isRegExp
assert.equal(true, util.isRegExp(/regexp/));
assert.equal(true, util.isRegExp(RegExp()));
assert.equal(true, util.isRegExp(new RegExp()));
assert.equal(true, util.isRegExp(context('RegExp')()));
assert.equal(false, util.isRegExp({}));
assert.equal(false, util.isRegExp([]));
assert.equal(false, util.isRegExp(new Date()));
assert.equal(false, util.isRegExp(Object.create(RegExp.prototype)));

// isDate
assert.equal(true, util.isDate(new Date()));
assert.equal(true, util.isDate(new Date(0)));
assert.equal(true, util.isDate(new (context('Date'))));
assert.equal(false, util.isDate(Date()));
assert.equal(false, util.isDate({}));
assert.equal(false, util.isDate([]));
assert.equal(false, util.isDate(new Error()));
assert.equal(false, util.isDate(Object.create(Date.prototype)));

// isError
assert.equal(true, util.isError(new Error()));
assert.equal(true, util.isError(new TypeError()));
assert.equal(true, util.isError(new SyntaxError()));
assert.equal(true, util.isError(new (context('Error'))));
assert.equal(true, util.isError(new (context('TypeError'))));
assert.equal(true, util.isError(new (context('SyntaxError'))));
assert.equal(false, util.isError({}));
assert.equal(false, util.isError({ name: 'Error', message: '' }));
assert.equal(false, util.isError([]));
assert.equal(true, util.isError(Object.create(Error.prototype)));

// isObject
assert.ok(util.isObject({}) === true);

// isPrimitive
assert.equal(false, util.isPrimitive({}));
assert.equal(false, util.isPrimitive(new Error()));
assert.equal(false, util.isPrimitive(new Date()));
assert.equal(false, util.isPrimitive([]));
assert.equal(false, util.isPrimitive(/regexp/));
assert.equal(false, util.isPrimitive(function() {}));
assert.equal(false, util.isPrimitive(new Number(1)));
assert.equal(false, util.isPrimitive(new String('bla')));
assert.equal(false, util.isPrimitive(new Boolean(true)));
assert.equal(true, util.isPrimitive(1));
assert.equal(true, util.isPrimitive('bla'));
assert.equal(true, util.isPrimitive(true));
assert.equal(true, util.isPrimitive(undefined));
assert.equal(true, util.isPrimitive(null));
assert.equal(true, util.isPrimitive(Infinity));
assert.equal(true, util.isPrimitive(NaN));
assert.equal(true, util.isPrimitive(Symbol('symbol')));

// isBuffer
assert.equal(false, util.isBuffer('foo'));
assert.equal(true, util.isBuffer(new Buffer('foo')));

// _extend
assert.deepEqual(util._extend({a:1}),             {a:1});
assert.deepEqual(util._extend({a:1}, []),         {a:1});
assert.deepEqual(util._extend({a:1}, null),       {a:1});
assert.deepEqual(util._extend({a:1}, true),       {a:1});
assert.deepEqual(util._extend({a:1}, false),      {a:1});
assert.deepEqual(util._extend({a:1}, {b:2}),      {a:1, b:2});
assert.deepEqual(util._extend({a:1, b:2}, {b:3}), {a:1, b:3});

// inherits
var ctor = function() {};
assert.throws(function() { util.inherits(ctor, {}); }, TypeError);
assert.throws(function() { util.inherits(ctor, null); }, TypeError);
assert.throws(function() { util.inherits(null, ctor); }, TypeError);
assert.doesNotThrow(function() { util.inherits(ctor, ctor); }, TypeError);

// format
var symbol = Symbol('foo');

assert.equal(util.format(), '');
assert.equal(util.format(''), '');
assert.equal(util.format([]), '[]');
assert.equal(util.format({}), '{}');
assert.equal(util.format(null), 'null');
assert.equal(util.format(true), 'true');
assert.equal(util.format(false), 'false');
assert.equal(util.format('test'), 'test');

// CHECKME this is for console.log() compatibility - but is it *right*?
assert.equal(util.format('foo', 'bar', 'baz'), 'foo bar baz');

// ES6 Symbol handling
assert.equal(util.format(symbol), 'Symbol(foo)');
assert.equal(util.format('foo', symbol), 'foo Symbol(foo)');
assert.equal(util.format('%s', symbol), 'Symbol(foo)');
assert.equal(util.format('%j', symbol), 'undefined');
assert.throws(function() {
  util.format('%d', symbol);
}, TypeError);

assert.equal(util.format('%d', 42.0), '42');
assert.equal(util.format('%d', 42), '42');
assert.equal(util.format('%s', 42), '42');
assert.equal(util.format('%j', 42), '42');

assert.equal(util.format('%d', '42.0'), '42');
assert.equal(util.format('%d', '42'), '42');
assert.equal(util.format('%s', '42'), '42');
assert.equal(util.format('%j', '42'), '"42"');

assert.equal(util.format('%%s%s', 'foo'), '%sfoo');

assert.equal(util.format('%s'), '%s');
assert.equal(util.format('%s', undefined), 'undefined');
assert.equal(util.format('%s', 'foo'), 'foo');
assert.equal(util.format('%s:%s'), '%s:%s');
assert.equal(util.format('%s:%s', undefined), 'undefined:%s');
assert.equal(util.format('%s:%s', 'foo'), 'foo:%s');
assert.equal(util.format('%s:%s', 'foo', 'bar'), 'foo:bar');
assert.equal(util.format('%s:%s', 'foo', 'bar', 'baz'), 'foo:bar baz');
assert.equal(util.format('%%%s%%', 'hi'), '%hi%');
assert.equal(util.format('%%%s%%%%', 'hi'), '%hi%%');

(function() {
  var o = {};
  o.o = o;
  assert.equal(util.format('%j', o), '[Circular]');
})();

// Errors
assert.equal(util.format(new Error('foo')), '[Error: foo]');
function CustomError(msg) {
  Error.call(this);
  Object.defineProperty(this, 'message',
                        { value: msg, enumerable: false });
  Object.defineProperty(this, 'name',
                        { value: 'CustomError', enumerable: false });
}
util.inherits(CustomError, Error);
assert.equal(util.format(new CustomError('bar')), '[CustomError: bar]');

// inspect

// test the internal isDate implementation
var Date2 = require('vm').runInNewContext('Date');
var d = new Date2();
var orig = util.inspect(d);
Date2.prototype.foo = 'bar';
var after = util.inspect(d);
assert.equal(orig, after);

// test positive/negative zero
assert.equal(util.inspect(0), '0');
assert.equal(util.inspect(-0), '-0');
assert.equal(util.inspect(1), '1');

assert.equal(util.inspect(false), 'false');
assert.equal(util.inspect(''), "''");
assert.equal(util.inspect('hello'), "'hello'");
assert.equal(util.inspect(function() {}), '[Function]');
assert.equal(util.inspect(undefined), 'undefined');
assert.equal(util.inspect(null), 'null');
assert.equal(util.inspect(/foo(bar\n)?/gi), '/foo(bar\\n)?/gi');
assert.equal(util.inspect(new Date('Sun, 14 Feb 2010 11:48:40 GMT')),
             new Date('2010-02-14T12:48:40+01:00').toString());

assert.equal(util.inspect('\n\u0001'), "'\\n\\u0001'");

assert.equal(util.inspect([]), '[]');
assert.equal(util.inspect(Object.create([])), 'Array {}');
assert.equal(util.inspect([1, 2]), '[ 1, 2 ]');
assert.equal(util.inspect([1, [2, 3]]), '[ 1, [ 2, 3 ] ]');

assert.equal(util.inspect({}), '{}');
assert.equal(util.inspect({a: 1}), '{ a: 1 }');
assert.equal(util.inspect({a: function() {}}), '{ a: [Function] }');
assert.equal(util.inspect({a: 1, b: 2}), '{ a: 1, b: 2 }');
assert.equal(util.inspect({'a': {}}), '{ a: {} }');
assert.equal(util.inspect({'a': {'b': 2}}), '{ a: { b: 2 } }');
assert.equal(util.inspect({'a': {'b': { 'c': { 'd': 2 }}}}),
             '{ a: { b: { c: [Object] } } }');
assert.equal(util.inspect({'a': {'b': { 'c': { 'd': 2 }}}}, false, null),
             '{ a: { b: { c: { d: 2 } } } }');
assert.equal(util.inspect([1, 2, 3], true), '[ 1, 2, 3, [length]: 3 ]');
assert.equal(util.inspect({'a': {'b': { 'c': 2}}}, false, 0),
             '{ a: [Object] }');
assert.equal(util.inspect({'a': {'b': { 'c': 2}}}, false, 1),
             '{ a: { b: [Object] } }');
assert.equal(util.inspect(Object.create({},
             {visible: {value: 1, enumerable: true}, hidden: {value: 2}})),
             '{ visible: 1 }');

// Due to the hash seed randomization it's not deterministic the order that
// the following ways this hash is displayed.
// See http://codereview.chromium.org/9124004/

var out = util.inspect(Object.create({},
   {visible: {value: 1, enumerable: true}, hidden: {value: 2}}), true);
if (out !== '{ [hidden]: 2, visible: 1 }' &&
   out !== '{ visible: 1, [hidden]: 2 }') {
 assert.ok(false);
}


// Objects without prototype
var out = util.inspect(Object.create(null,
   { name: {value: 'Tim', enumerable: true},
     hidden: {value: 'secret'}}), true);
if (out !== "{ [hidden]: 'secret', name: 'Tim' }" &&
   out !== "{ name: 'Tim', [hidden]: 'secret' }") {
 assert(false);
}


assert.equal(util.inspect(Object.create(null,
                                {name: {value: 'Tim', enumerable: true},
                                hidden: {value: 'secret'}})),
                                '{ name: \'Tim\' }');


// Dynamic properties
assert.equal(util.inspect({get readonly() {}}), '{ readonly: [Getter] }');

assert.equal(util.inspect({get readwrite() {}, set readwrite(val) {}}),
             '{ readwrite: [Getter/Setter] }');

assert.equal(util.inspect({set writeonly(val) {}}),
             '{ writeonly: [Setter] }');

var value = {};
value['a'] = value;
assert.equal(util.inspect(value), '{ a: [Circular] }');

// Array with dynamic properties
value = [1, 2, 3];
value.__defineGetter__('growingLength', function() {
 this.push(true); return this.length;
});
assert.equal(util.inspect(value), '[ 1, 2, 3, growingLength: [Getter] ]');

// Function with properties
value = function() {};
value.aprop = 42;
assert.equal(util.inspect(value), '{ [Function] aprop: 42 }');

// Regular expressions with properties
value = /123/ig;
value.aprop = 42;
assert.equal(util.inspect(value), '{ /123/gi aprop: 42 }');

// Dates with properties
value = new Date('Sun, 14 Feb 2010 11:48:40 GMT');
value.aprop = 42;
assert.equal(util.inspect(value),
             '{ Sun, 14 Feb 2010 11:48:40 GMT aprop: 42 }');


// test for sparse array
var a = ['foo', 'bar', 'baz'];
assert.equal(util.inspect(a), '[ \'foo\', \'bar\', \'baz\' ]');
delete a[1];
assert.equal(util.inspect(a), '[ \'foo\', , \'baz\' ]');
assert.equal(util.inspect(a, true), '[ \'foo\', , \'baz\', [length]: 3 ]');
assert.equal(util.inspect(new Array(5)), '[ , , , ,  ]');

// test for property descriptors
var getter = Object.create(null, {
  a: {
    get: function() { return 'aaa'; }
  }
});
var setter = Object.create(null, {
  b: {
    set: function() {}
  }
});
var getterAndSetter = Object.create(null, {
  c: {
    get: function() { return 'ccc'; },
    set: function() {}
  }
});
assert.equal(util.inspect(getter, true), '{ [a]: [Getter] }');
assert.equal(util.inspect(setter, true), '{ [b]: [Setter] }');
assert.equal(util.inspect(getterAndSetter, true), '{ [c]: [Getter/Setter] }');

// exceptions should print the error message, not '{}'
assert.equal(util.inspect(new Error()), '[Error]');
assert.equal(util.inspect(new Error('FAIL')), '[Error: FAIL]');
assert.equal(util.inspect(new TypeError('FAIL')), '[TypeError: FAIL]');
assert.equal(util.inspect(new SyntaxError('FAIL')), '[SyntaxError: FAIL]');
try {
  undef();
} catch (e) {
  assert.equal(util.inspect(e), '[ReferenceError: undef is not defined]');
}
var ex = util.inspect(new Error('FAIL'), true);
assert.ok(ex.indexOf('[Error: FAIL]') != -1);
assert.ok(ex.indexOf('[stack]') != -1);
assert.ok(ex.indexOf('[message]') != -1);

// GH-1941
// should not throw:
assert.equal(util.inspect(Object.create(Date.prototype)), 'Date {}');

// GH-1944
assert.doesNotThrow(function() {
  var d = new Date();
  d.toUTCString = null;
  util.inspect(d);
});

assert.doesNotThrow(function() {
  var r = /regexp/;
  r.toString = null;
  util.inspect(r);
});

// bug with user-supplied inspect function returns non-string
assert.doesNotThrow(function() {
  util.inspect([{
    inspect: function() { return 123; }
  }]);
});

// GH-2225
var x = { inspect: util.inspect };
assert.ok(util.inspect(x).indexOf('inspect') != -1);

// util.inspect should not display the escaped value of a key.
var w = {
  '\\': 1,
  '\\\\': 2,
  '\\\\\\': 3,
  '\\\\\\\\': 4,
};

var y = ['a', 'b', 'c'];
y['\\\\\\'] = 'd';

assert.ok(util.inspect(w),
          '{ \'\\\': 1, \'\\\\\': 2, \'\\\\\\\': 3, \'\\\\\\\\\': 4 }');
assert.ok(util.inspect(y), '[ \'a\', \'b\', \'c\', \'\\\\\\\': \'d\' ]');

// util.inspect.styles and util.inspect.colors
function test_color_style(style, input, implicit) {
  var color_name = util.inspect.styles[style];
  var color = ['', ''];
  if (util.inspect.colors[color_name])
    color = util.inspect.colors[color_name];

  var without_color = util.inspect(input, false, 0, false);
  var with_color = util.inspect(input, false, 0, true);
  var expect = '\u001b[' + color[0] + 'm' + without_color +
               '\u001b[' + color[1] + 'm';
  assert.equal(with_color, expect, 'util.inspect color for style ' + style);
}

test_color_style('special', function() {});
test_color_style('number', 123.456);
test_color_style('boolean', true);
test_color_style('undefined', undefined);
test_color_style('null', null);
test_color_style('string', 'test string');
test_color_style('date', new Date());
test_color_style('regexp', /regexp/);

// an object with "hasOwnProperty" overwritten should not throw
assert.doesNotThrow(function() {
  util.inspect({
    hasOwnProperty: null
  });
});

// new API, accepts an "options" object
var subject = { foo: 'bar', hello: 31, a: { b: { c: { d: 0 } } } };
Object.defineProperty(subject, 'hidden', { enumerable: false, value: null });

assert(util.inspect(subject, { showHidden: false }).indexOf('hidden') === -1);
assert(util.inspect(subject, { showHidden: true }).indexOf('hidden') !== -1);
assert(util.inspect(subject, { colors: false }).indexOf('\u001b[32m') === -1);
assert(util.inspect(subject, { colors: true }).indexOf('\u001b[32m') !== -1);
assert(util.inspect(subject, { depth: 2 }).indexOf('c: [Object]') !== -1);
assert(util.inspect(subject, { depth: 0 }).indexOf('a: [Object]') !== -1);
assert(util.inspect(subject, { depth: null }).indexOf('{ d: 0 }') !== -1);

// "customInspect" option can enable/disable calling inspect() on objects
subject = { inspect: function() { return 123; } };

assert(util.inspect(subject,
                    { customInspect: true }).indexOf('123') !== -1);
assert(util.inspect(subject,
                    { customInspect: true }).indexOf('inspect') === -1);
assert(util.inspect(subject,
                    { customInspect: false }).indexOf('123') === -1);
assert(util.inspect(subject,
                    { customInspect: false }).indexOf('inspect') !== -1);

// custom inspect() functions should be able to return other Objects
subject.inspect = function() { return { foo: 'bar' }; };

assert.equal(util.inspect(subject), '{ foo: \'bar\' }');

subject.inspect = function(depth, opts) {
  assert.strictEqual(opts.customInspectOptions, true);
};

util.inspect(subject, { customInspectOptions: true });

// util.inspect with "colors" option should produce as many lines as without it
function test_lines(input) {
  var count_lines = function(str) {
    return (str.match(/\n/g) || []).length;
  };

  var without_color = util.inspect(input);
  var with_color = util.inspect(input, {colors: true});
  assert.equal(count_lines(without_color), count_lines(with_color));
}

test_lines([1, 2, 3, 4, 5, 6, 7]);
test_lines(function() {
  var big_array = [];
  for (var i = 0; i < 100; i++) {
    big_array.push(i);
  }
  return big_array;
}());
test_lines({foo: 'bar', baz: 35, b: {a: 35}});
test_lines({
  foo: 'bar',
  baz: 35,
  b: {a: 35},
  very_long_key: 'very_long_value',
  even_longer_key: ['with even longer value in array']
});

// test boxed primitives output the correct values
assert.equal(util.inspect(new String('test')), '[String: \'test\']');
assert.equal(util.inspect(new Boolean(false)), '[Boolean: false]');
assert.equal(util.inspect(new Boolean(true)), '[Boolean: true]');
assert.equal(util.inspect(new Number(0)), '[Number: 0]');
assert.equal(util.inspect(new Number(-0)), '[Number: -0]');
assert.equal(util.inspect(new Number(-1.1)), '[Number: -1.1]');
assert.equal(util.inspect(new Number(13.37)), '[Number: 13.37]');

// test boxed primitives with own properties
var str = new String('baz');
str.foo = 'bar';
assert.equal(util.inspect(str), '{ [String: \'baz\'] foo: \'bar\' }');

var bool = new Boolean(true);
bool.foo = 'bar';
assert.equal(util.inspect(bool), '{ [Boolean: true] foo: \'bar\' }');

var num = new Number(13.37);
num.foo = 'bar';
assert.equal(util.inspect(num), '{ [Number: 13.37] foo: \'bar\' }');

// test es6 Symbol
if (typeof Symbol !== 'undefined') {
  assert.equal(util.inspect(Symbol()), 'Symbol()');
  assert.equal(util.inspect(Symbol(123)), 'Symbol(123)');
  assert.equal(util.inspect(Symbol('hi')), 'Symbol(hi)');
  assert.equal(util.inspect([Symbol()]), '[ Symbol() ]');
  assert.equal(util.inspect({ foo: Symbol() }), '{ foo: Symbol() }');

  var options = { showHidden: true };
  var subject = {};

  subject[Symbol('symbol')] = 42;

  assert.equal(util.inspect(subject), '{}');
  assert.equal(util.inspect(subject, options), '{ [Symbol(symbol)]: 42 }');

  subject = [1, 2, 3];
  subject[Symbol('symbol')] = 42;

  assert.equal(util.inspect(subject), '[ 1, 2, 3 ]');
  assert.equal(util.inspect(subject, options),
      '[ 1, 2, 3, [length]: 3, [Symbol(symbol)]: 42 ]');

}

// test Set
assert.equal(util.inspect(new Set()), 'Set {}');
assert.equal(util.inspect(new Set([1, 2, 3])), 'Set { 1, 2, 3 }');
var set = new Set(['foo']);
set.bar = 42;
assert.equal(util.inspect(set, true), 'Set { \'foo\', [size]: 1, bar: 42 }');

// test Map
assert.equal(util.inspect(new Map()), 'Map {}');
assert.equal(util.inspect(new Map([[1, 'a'], [2, 'b'], [3, 'c']])),
             'Map { 1 => \'a\', 2 => \'b\', 3 => \'c\' }');
var map = new Map([['foo', null]]);
map.bar = 42;
assert.equal(util.inspect(map, true),
             'Map { \'foo\' => null, [size]: 1, bar: 42 }');

// test Promise
assert.equal(util.inspect(Promise.resolve(3)), 'Promise { 3 }');
assert.equal(util.inspect(Promise.reject(3)), 'Promise { <rejected> 3 }');
assert.equal(util.inspect(new Promise(function() {})), 'Promise { <pending> }');
var promise = Promise.resolve('foo');
promise.bar = 42;
assert.equal(util.inspect(promise), 'Promise { \'foo\', bar: 42 }');

// Make sure it doesn't choke on polyfills. Unlike Set/Map, there is no standard
// interface to synchronously inspect a Promise, so our techniques only work on
// a bonafide native Promise.
var oldPromise = Promise;
global.Promise = function() { this.bar = 42; };
assert.equal(util.inspect(new Promise()), '{ bar: 42 }');
global.Promise = oldPromise;


// Test alignment of items in container
// Assumes that the first numeric character is the start of an item.

function checkAlignment(container) {
  var lines = util.inspect(container).split('\n');
  var pos;
  lines.forEach(function(line) {
    var npos = line.search(/\d/);
    if (npos !== -1) {
      if (pos !== undefined)
        assert.equal(pos, npos, 'container items not aligned');
      pos = npos;
    }
  });
}

var big_array = [];
for (var i = 0; i < 100; i++) {
  big_array.push(i);
}

checkAlignment(big_array);
checkAlignment(function() {
  var obj = {};
  big_array.forEach(function(v) {
    obj[v] = null;
  });
  return obj;
}());
checkAlignment(new Set(big_array));
checkAlignment(new Map(big_array.map(function(y) { return [y, null]; })));


// Test display of constructors

class ObjectSubclass {}
class ArraySubclass extends Array {}
class SetSubclass extends Set {}
class MapSubclass extends Map {}
class PromiseSubclass extends Promise {}

var x = new ObjectSubclass();
x.foo = 42;
assert.equal(util.inspect(x),
             'ObjectSubclass { foo: 42 }');
assert.equal(util.inspect(new ArraySubclass(1, 2, 3)),
             'ArraySubclass [ 1, 2, 3 ]');
assert.equal(util.inspect(new SetSubclass([1, 2, 3])),
             'SetSubclass { 1, 2, 3 }');
assert.equal(util.inspect(new MapSubclass([['foo', 42]])),
            'MapSubclass { \'foo\' => 42 }');
assert.equal(util.inspect(new PromiseSubclass(function() {})),
             'PromiseSubclass { <pending> }');

// Corner cases.
var x = { constructor: 42 };
assert.equal(util.inspect(x), '{ constructor: 42 }');

var x = {};
Object.defineProperty(x, 'constructor', {
  get: function() {
    throw new Error('should not access constructor');
  },
  enumerable: true
});
assert.equal(util.inspect(x), '{ constructor: [Getter] }');

var x = new (function() {});
assert.equal(util.inspect(x), '{}');

var x = Object.create(null);
assert.equal(util.inspect(x), '{}');
