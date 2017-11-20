define('code-corps-ember/components/user-dropdown', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var service = Ember.inject.service;
  exports.default = Component.extend({
    classNames: ['dropdown-menu', 'dropdown-menu--right'],
    /**
      @property session
      @type Ember.Service
     */
    session: service(),

    click: function click() {
      this.sendAction();
    },


    actions: {
      /**
       Action to invalidate the user session
        @method invalidateSession
       */
      invalidateSession: function invalidateSession() {
        this.get('session').invalidate();
      }
    }
  });
});