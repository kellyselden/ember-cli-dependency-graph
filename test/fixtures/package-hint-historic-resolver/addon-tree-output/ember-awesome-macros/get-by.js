define('ember-awesome-macros/get-by', ['exports', 'ember-macro-helpers/create-class-computed'], function (exports, _createClassComputed) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var readOnly = Ember.computed.readOnly;
  exports.default = (0, _createClassComputed.default)([false, true], function (obj, key) {
    return readOnly(obj + '.' + key);
  });
});