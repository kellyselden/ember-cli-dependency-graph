define('ember-awesome-macros/promise/array', ['exports', 'ember-awesome-macros/promise/-utils'], function (exports, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var ArrayProxy = Ember.ArrayProxy;
  exports.default = (0, _utils.wrapPromiseProxy)(ArrayProxy);
});