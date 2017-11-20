define('percy-web/services/intercom', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Service = Ember.Service;
  var service = Ember.inject.service;
  exports.default = Service.extend({
    adminMode: service(),

    associateWithCompany: function associateWithCompany(user, organization) {
      if (this.get('adminMode').excludeFromAnalytics()) {
        return;
      }

      if (window.Intercom && user.get('id')) {
        window.Intercom('update', {
          user_hash: user.get('userHash'),
          company: {
            id: organization.get('id'),
            name: organization.get('name')
          }
        });
      }
    }
  });
});