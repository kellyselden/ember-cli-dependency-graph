define('ember-composable-helpers/utils/is-object', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isObject;
  var typeOf = Ember.typeOf;
  function isObject(val) {
    return typeOf(val) === 'object' || typeOf(val) === 'instance';
  }
});