define('percy-web/routes/docs/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Route = Ember.Route;
  exports.default = Route.extend({
    actions: {
      didTransition: function didTransition() {
        this._super.apply(this, arguments);
        this.analytics.track('Docs Page Viewed', null, { path: '/docs' });
      }
    }
  });
});