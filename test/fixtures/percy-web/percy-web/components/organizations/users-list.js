define('percy-web/components/organizations/users-list', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    organization: null,
    classes: null,

    classNames: ['OrganizationsUsersList'],
    classNameBindings: ['classes'],
    actions: {}
  });
});