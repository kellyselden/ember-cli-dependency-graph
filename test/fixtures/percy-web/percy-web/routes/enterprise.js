define('percy-web/routes/enterprise', ['exports', 'percy-web/mixins/reset-scroll'], function (exports, _resetScroll) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Route = Ember.Route;
  exports.default = Route.extend(_resetScroll.default, {
    actions: {
      didTransition: function didTransition() {
        this._super.apply(this, arguments);

        // TODO: Add organization tracking
        this.analytics.track('Enterprise Viewed');
      }
    }
  });
});