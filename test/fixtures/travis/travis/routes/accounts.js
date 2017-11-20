define('travis/routes/accounts', ['exports', 'travis/routes/basic'], function (exports, _basic) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _basic.default.extend({
    model: function model() {
      return this.store.query('account', {
        all: true
      });
    },
    setupController: function setupController(controller, model) {
      var orgs = void 0,
          user = void 0;
      user = model.filterBy('type', 'user')[0];
      orgs = model.filterBy('type', 'organization');
      controller.set('user', user);
      controller.set('organizations', orgs);
      return controller.set('model', model);
    }
  });
});