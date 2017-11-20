define('code-corps-ember/controllers/admin/github-events/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Controller = Ember.Controller;
  exports.default = Controller.extend({
    queryParams: ['page', 'size'],
    page: 1,
    size: 20
  });
});