define('travis/utils/wrap-with-array', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (object) {
    if (isArray(object)) {
      return object;
    } else if (object) {
      return [object];
    } else {
      return [];
    }
  };

  var isArray = Ember.isArray;
});