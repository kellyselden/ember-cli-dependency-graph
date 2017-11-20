define('code-corps-ember/routes/admin/github-events/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Route = Ember.Route;
  exports.default = Route.extend({
    model: function model(params) {
      return this.store.query('github-event', {
        page: {
          page: params.page,
          'page-size': params.size
        }
      });
    },


    queryParams: {
      page: {
        refreshModel: true
      },
      size: {
        refreshModel: true
      }
    }
  });
});