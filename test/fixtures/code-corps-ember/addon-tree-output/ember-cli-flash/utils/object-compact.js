define('ember-cli-flash/utils/object-compact', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = objectCompact;
  var isPresent = Ember.isPresent;
  function objectCompact(objectInstance) {
    var compactedObject = {};

    for (var key in objectInstance) {
      var value = objectInstance[key];

      if (isPresent(value)) {
        compactedObject[key] = value;
      }
    }

    return compactedObject;
  }
});