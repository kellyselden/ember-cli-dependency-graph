define('ember-macro-helpers/raw', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (key) {
    return computed(function () {
      return key;
    }).readOnly();
  };

  var computed = Ember.computed;
});