'use strict';

const common = require('../common')
const assert = require('assert');
const types = require('types');

function map(name, pass, fail) {
  const item = {
    name: name,
    passes: pass,
    failures: fail
  };

  return item;
}

function getArguments() {
  return arguments;
}

const ARGUMENTS = { type: 'arguments', value: getArguments() };
const TRUE = { type: 'true', value: true };
const TRUE_OBJECT = { type: 'true_object', value: new Boolean(true) };
const FALSE = { type: 'false', value: false };
const FALSE_OBJECT = { type: 'false_object', value: new Boolean(false) };
const OBJECT = { type: 'object', value: {} };
const ARRAY = { type: 'array', value: [] };
const NUMBER = { type: 'number', value: 1 };
const NUMBER_OBJECT = { type: 'number_object', value: new Number(1) };
const FLOAT = { type: 'float', value: 1.25 };
const NULL = { type: 'null', value: null };
const UNDEFINED = { type: 'undefined', value: undefined };
const STRING = { type: 'string', value: 'string' };
const DATE = { type: 'date', value: new Date() };
const FUNCTION = { type: 'function', value: function() {} };
const MAP = { type: 'map', value: new Map() };
const SET = { type: 'set', value: new Set() };
const MAP_ITERATOR = { type: 'map_iterator', value: new Map().keys() };
const SET_ITERATOR = { type: 'set_iterator', value: new Set().keys() };
const ERROR = { type: 'error', value: new Error() };
const TYPE_ERROR = { type: 'type_error', value: new TypeError() };
const SYMBOL = { type: 'symbol', value: Symbol('test') };
const SYMBOL_OBJECT = { type: 'symbol_object', value: new Object(Symbol('a')) };
const POSITIVE_INT = { type: 'positive_int', value: 1 };
const NEGATIVE_INT = { type: 'negative_int', value: -1 };
const WEAK_MAP = { type: 'weak_map', value: new WeakMap() };
const WEAK_SET = { type: 'weak_set', value: new WeakSet() };

const fns = new Set([
  map('isArgumentsObject', [
    ARGUMENTS
  ], [
    OBJECT,
    STRING
  ]),
  map('isArray', [
    ARRAY
  ], [
    OBJECT,
    STRING,
    NULL
  ]),
  // 'isArrayBuffer',
  // 'isArrayBufferView',
  map('isBoolean', [
    TRUE,
    FALSE
  ], [
    OBJECT,
    NULL
  ]),
  map('isBooleanObject', [
    TRUE_OBJECT,
    FALSE_OBJECT
  ], [
    TRUE,
    FALSE,
    STRING
  ]),
  // 'isDataView',
  map('isDate', [DATE], [STRING, OBJECT, TRUE]),
  map('isFalse', [FALSE], [TRUE, FALSE_OBJECT, TRUE_OBJECT]),
  // 'isFloat32Array',
  // 'isFloat64Array',
  map('isFunction', [FUNCTION], [OBJECT, ARRAY, TRUE]),
  // 'isGeneratorFunction',
  // 'isGeneratorObject',
  map('isInt32', [POSITIVE_INT, NEGATIVE_INT], [STRING]),
  // 'isInt8Array',
  // 'isInt16Array',
  // 'isInt32Array',
  map('isMap', [MAP], [SET, OBJECT]),
  map('isMapIterator', [MAP_ITERATOR], [MAP, SET_ITERATOR, SET]),
  map('isNativeError', [ERROR, TYPE_ERROR], [OBJECT, ARRAY]),
  map('isNull', [NULL], [OBJECT, UNDEFINED]),
  map('isNumber', [NUMBER, FLOAT], [STRING, OBJECT]),
  map('isNumberObject', [NUMBER_OBJECT], [NUMBER, STRING]),
  map('isObject', [OBJECT, ARRAY, FUNCTION], [STRING, TRUE, NULL]),
  // 'isPromise',
  // 'isProxy',
  // 'isRegExp',
  map('isSet', [SET], [MAP, OBJECT]),
  map('isSetIterator', [SET_ITERATOR], [MAP, MAP_ITERATOR, SET]),
  // 'isSharedArrayBuffer',
  map('isString', [STRING], [OBJECT, TRUE]),
  // 'isStringObject',
  map('isSymbol', [SYMBOL], [STRING, OBJECT]),
  map('isSymbolObject', [SYMBOL_OBJECT], [SYMBOL, OBJECT, STRING]),
  map('isTrue', [TRUE], [FALSE, FALSE_OBJECT, TRUE_OBJECT]),
  // 'isTypedArray',
  map('isUint32', [POSITIVE_INT], [NEGATIVE_INT, STRING]),
  // 'isUint8Array',
  // 'isUint8ClampedArray',
  // 'isUint16Array',
  // 'isUint32Array',
  map('isUndefined', [UNDEFINED], [NULL, FALSE, OBJECT]),
  map('isWeakMap', [WEAK_MAP], [MAP, WEAK_SET, SET]),
  map('isWeakSet', [WEAK_SET], [SET, WEAK_MAP, MAP])
]);

for (const {name, passes, failures} of fns) {
  console.log(name)
  for (const pass of passes) {
    const res = types[name](pass.value);
    console.log('  (PASS) %s %s %s', pass.type, typeof pass.value, res);
    assert.strictEqual(res, true);
  }

  for (const fail of failures) {
    const res = types[name](fail.value);
    console.log('  (FAIL) %s %s %s', fail.type, typeof fail.value, res);
    assert.strictEqual(res, false);
  }
  console.log()
}
