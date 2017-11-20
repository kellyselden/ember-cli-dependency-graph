define('percy-web/components/admin-toggle', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var on = Ember.on;
  var service = Ember.inject.service;
  var Component = Ember.Component;
  exports.default = Component.extend({
    isAdminEnabled: false,
    adminMode: service(),

    setup: on('init', function () {
      this.set('isAdminEnabled', this.get('adminMode').get() == 'admin');
    }),

    actions: {
      toggleAdmin: function toggleAdmin() {
        this.toggleProperty('isAdminEnabled');

        if (this.get('isAdminEnabled')) {
          this.get('adminMode').set('admin');
        } else {
          this.get('adminMode').clear();
        }
      }
    }
  });
});