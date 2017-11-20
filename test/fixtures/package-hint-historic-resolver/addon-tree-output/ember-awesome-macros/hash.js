define('ember-awesome-macros/hash', ['exports', 'ember-macro-helpers/curried-computed'], function (exports, _curriedComputed) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.deconstructArgs = deconstructArgs;
  exports.reduceValues = reduceValues;

  exports.default = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _deconstructArgs = deconstructArgs(args),
        hashKeys = _deconstructArgs.hashKeys,
        hashValues = _deconstructArgs.hashValues;

    return (0, _curriedComputed.default)(function () {
      for (var _len2 = arguments.length, newValues = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        newValues[_key2] = arguments[_key2];
      }

      var newHash = reduceValues(hashKeys, newValues);
      return EmberObject.create(newHash);
    }).apply(undefined, _toConsumableArray(hashValues));
  };

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var EmberObject = Ember.Object;
  function deconstructArgs(args) {
    var hashKeys = [];
    var hashValues = [];

    args.forEach(function (arg) {
      if (typeof arg === 'string') {
        hashKeys.push(arg);
        hashValues.push(arg);
      } else {
        var props = Object.getOwnPropertyNames(arg);
        hashKeys = hashKeys.concat(props);
        hashValues = hashValues.concat(props.map(function (prop) {
          return arg[prop];
        }));
      }
    });

    return {
      hashKeys: hashKeys,
      hashValues: hashValues
    };
  }

  function reduceValues(hashKeys, newValues) {
    return newValues.reduce(function (newHash, val, i) {
      newHash[hashKeys[i]] = val;
      return newHash;
    }, {});
  }
});