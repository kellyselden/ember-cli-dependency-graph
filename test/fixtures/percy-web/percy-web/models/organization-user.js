define('percy-web/models/organization-user', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed;


  var ROLE_ID_TO_TITLE = {
    admin: 'Administrator',
    member: 'Member',
    billing_admin: 'Billing Admin'
  };

  exports.default = _emberData.default.Model.extend({
    organization: _emberData.default.belongsTo('organization', { async: false }),
    user: _emberData.default.belongsTo('user', { async: false, inverse: null }),
    role: _emberData.default.attr(),

    roleTitle: computed('role', function () {
      return ROLE_ID_TO_TITLE[this.get('role')];
    })
  });
});