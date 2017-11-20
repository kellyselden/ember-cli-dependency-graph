define('ember-awesome-macros/promise/hash', ['exports', 'ember-macro-helpers/curried-computed', 'ember-awesome-macros/hash'], function (exports, _curriedComputed, _hash) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _deconstructArgs = (0, _hash.deconstructArgs)(args),
        hashKeys = _deconstructArgs.hashKeys,
        hashValues = _deconstructArgs.hashValues;

    return (0, _curriedComputed.default)(function () {
      for (var _len2 = arguments.length, newValues = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        newValues[_key2] = arguments[_key2];
      }

      var newHash = (0, _hash.reduceValues)(hashKeys, newValues);
      return hash(newHash);
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

  var RSVP = Ember.RSVP;
  var hash = RSVP.hash;
});