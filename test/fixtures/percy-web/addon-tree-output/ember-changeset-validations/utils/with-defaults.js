define('ember-changeset-validations/utils/with-defaults', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = withDefaults;


  var assign = Ember.merge || Ember.assign;

  /**
   * Create a new object with defaults
   *
   * @public
   * @param  {Object} obj
   * @param  {Object} defaults
   * @return {Object}
   */
  function withDefaults() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var defaults = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return assign(assign({}, defaults), obj);
  }
});