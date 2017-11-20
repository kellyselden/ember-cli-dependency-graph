define('code-corps-ember/routes/admin/github-events/github-event', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Route = Ember.Route;
  exports.default = Route.extend({
    model: function model(params) {
      return this.store.find('github-event', params.id);
    }
  });
});