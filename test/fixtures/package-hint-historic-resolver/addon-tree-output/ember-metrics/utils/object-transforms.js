define('ember-metrics/utils/object-transforms', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.compact = compact;
  exports.without = without;
  exports.only = only;
  exports.isPresent = isPresent;
  function compact(objectInstance) {
    var compactedObject = {};

    for (var key in objectInstance) {
      var value = objectInstance[key];

      if (Ember.isPresent(value)) {
        compactedObject[key] = value;
      }
    }

    return compactedObject;
  }

  function without(originalObj, keysToRemove) {
    var newObj = {};
    var allKeys = Object.keys(originalObj);

    allKeys.forEach(function (key) {
      if (keysToRemove.indexOf(key) === -1) {
        newObj[key] = originalObj[key];
      }
    });

    return newObj;
  }

  function only(originalObj, keysToRemain) {
    var newObj = {};
    var allKeys = Object.keys(originalObj);

    allKeys.forEach(function (key) {
      if (keysToRemain.indexOf(key) !== -1) {
        newObj[key] = originalObj[key];
      }
    });

    return newObj;
  }

  function isPresent(objectInstance) {
    var keys = Object.keys(objectInstance);

    return !!keys.length;
  }
});