define('code-corps-ember/abilities/organization', ['exports', 'ember-can'], function (exports, _emberCan) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var alias = Ember.computed.alias;
  var get = Ember.get;
  var computed = Ember.computed;
  var service = Ember.inject.service;
  exports.default = _emberCan.Ability.extend({
    currentUser: service(),

    canManage: computed('organization.owner.id', 'currentUser.user.id', function () {
      return get(this, 'organization.owner.id') === get(this, 'currentUser.user.id');
    }),

    organization: alias('model')
  });
});