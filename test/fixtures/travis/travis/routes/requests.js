define('travis/routes/requests', ['exports', 'travis/routes/basic'], function (exports, _basic) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _basic.default.extend({
    setupController: function setupController() {
      this._super.apply(this, arguments);
      return this.controllerFor('repo').activate('requests');
    },
    model: function model() {
      return this.store.query('request', {
        repository_id: this.modelFor('repo').get('id')
      });
    }
  });
});