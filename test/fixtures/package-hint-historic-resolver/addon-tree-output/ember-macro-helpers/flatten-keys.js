define('ember-macro-helpers/flatten-keys', ['exports', 'ember-macro-helpers/is-computed'], function (exports, _isComputed) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (keys) {
    var flattenedKeys = [];
    _flattenKeys(keys.slice(0, -1), flattenedKeys);
    var lastKey = keys[keys.length - 1];
    if (lastKey) {
      var lastValue = flattenKey(lastKey, flattenedKeys);
      if (lastValue) {
        if (lastValue.get) {
          flattenKey(lastValue.get, flattenedKeys);
        }
        if (lastValue.set) {
          flattenKey(lastValue.set, flattenedKeys);
        }
      }
    }
    return flattenedKeys;
  };

  function flattenKey(key, flattenedKeys) {
    if ((0, _isComputed.default)(key)) {
      var dependentKeys = key._dependentKeys;
      if (dependentKeys === undefined) {
        // when there are no keys (raw)
        return;
      }

      return _flattenKeys(dependentKeys, flattenedKeys);
    }

    if (typeof key !== 'string') {
      return key;
    }

    flattenedKeys.push(key);
  }

  function _flattenKeys(keys, flattenedKeys) {
    keys.forEach(function (key) {
      flattenKey(key, flattenedKeys);
    });
  }
});