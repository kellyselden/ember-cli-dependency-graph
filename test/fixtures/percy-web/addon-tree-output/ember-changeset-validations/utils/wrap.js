define('ember-changeset-validations/utils/wrap', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = wrapInArray;
  var emberArray = Ember.A,
      isArray = Ember.isArray;


  /**
   * Wraps a value in an Ember.Array.
   *
   * @public
   * @param  {Any} value
   * @return {Ember.Array}
   */
  function wrapInArray(value) {
    if (isArray(value)) {
      return emberArray(value);
    }

    return emberArray([value]);
  }
});