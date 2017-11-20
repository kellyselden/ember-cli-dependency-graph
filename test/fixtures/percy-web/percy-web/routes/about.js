define('percy-web/routes/about', ['exports', 'percy-web/mixins/reset-scroll'], function (exports, _resetScroll) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Route = Ember.Route;
  exports.default = Route.extend(_resetScroll.default, {});
});