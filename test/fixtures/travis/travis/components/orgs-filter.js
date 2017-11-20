define('travis/components/orgs-filter', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    classNames: ['organisation-filter'],
    classNameBindings: ['showFilter:is-open'],

    actions: {
      toggleOrgFilter: function toggleOrgFilter() {
        this.toggleProperty('showFilter');
        return false;
      },
      select: function select(org) {
        this.toggleProperty('showFilter');
        this.set('showFilter', false);
        return this.sendAction('action', org);
      }
    }
  });
});