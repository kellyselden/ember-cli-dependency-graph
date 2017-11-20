define('ember-awesome-macros/promise/object', ['exports', 'ember-awesome-macros/promise/-utils'], function (exports, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var ObjectProxy = Ember.ObjectProxy;
  exports.default = (0, _utils.wrapPromiseProxy)(ObjectProxy);
});