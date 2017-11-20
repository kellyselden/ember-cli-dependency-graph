define('ember-composable-helpers/-private/closure-action', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var __loader = Ember.__loader;


  var ClosureActionModule = { ACTION: null };

  if ('ember-htmlbars/keywords/closure-action' in __loader.registry) {
    ClosureActionModule = __loader.require('ember-htmlbars/keywords/closure-action');
  } else if ('ember-routing-htmlbars/keywords/closure-action' in __loader.registry) {
    ClosureActionModule = __loader.require('ember-routing-htmlbars/keywords/closure-action');
  }

  exports.default = ClosureActionModule.ACTION;
});