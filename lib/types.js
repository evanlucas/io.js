'use strict';

const binding = process.binding('types');
const keys = Object.keys(binding);
for (const key of keys) {
  exports[key] = function(arg) {
    return binding[key](arg);
  };
}
