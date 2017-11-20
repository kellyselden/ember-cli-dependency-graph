define('code-corps-ember/components/payments/donation-goals', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var get = Ember.get;
  var computed = Ember.computed;
  exports.default = Component.extend({
    classNameBindings: ['highlightClass'],
    classNames: ['donation-goals', 'panel'],

    status: computed('donationsActive', 'transfersEnabled', function () {
      var donationsActive = get(this, 'donationsActive');
      var transfersEnabled = get(this, 'transfersEnabled');

      if (donationsActive) {
        return 'verified';
      } else if (transfersEnabled) {
        return 'required';
      } else {
        return 'pending_requirement';
      }
    }),

    highlightClass: computed('status', function () {
      var status = get(this, 'status');

      if (status == 'verified') {
        return 'panel--highlighted-green';
      } else if (status == 'required') {
        return 'panel--highlighted';
      } else {
        return '';
      }
    })
  });
});