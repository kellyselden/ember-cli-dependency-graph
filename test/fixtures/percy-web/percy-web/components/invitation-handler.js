define('percy-web/components/invitation-handler', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var alias = Ember.computed.alias;
  var service = Ember.inject.service;
  var Component = Ember.Component;
  exports.default = Component.extend({
    invitation: null,

    classNames: ['InvitationHandler'],
    session: service(),
    currentUser: alias('session.currentUser'),

    actions: {
      logout: function logout() {
        this.sendAction('logout');
      },
      accept: function accept() {
        var _this = this;

        // Invitations are accepted with a PATCH request against the invite endpoint.
        this.get('invitation').save().then(function (model) {
          _this.sendAction('inviteAccepted', model);
        }, function () {
          alert('Something went wrong! You might already be in this organization. ' + 'Feel free to reach out to hello@percy.io for help.');
        });
      }
    }
  });
});