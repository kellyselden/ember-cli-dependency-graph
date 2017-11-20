define('percy-web/components/forms/organization-user-edit', ['exports', 'percy-web/components/forms/base'], function (exports, _base) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed;
  var alias = Ember.computed.alias;
  var service = Ember.inject.service;
  exports.default = _base.default.extend({
    organizationUser: null,
    classes: null,

    classNames: ['FormsOrganizationUserEdit', 'Form'],
    classNameBindings: ['classes'],

    session: service(),
    currentUser: alias('session.currentUser'),
    isCurrentUser: computed('organizationUser', 'currentUser', function () {
      return this.get('organizationUser.user.id') === this.get('currentUser.id');
    }),
    deleteText: computed('isCurrentUser', function () {
      if (this.get('isCurrentUser')) {
        return 'Leave Organization';
      } else {
        return 'Remove User';
      }
    }),
    model: alias('organizationUser'),
    validator: null
  });
});