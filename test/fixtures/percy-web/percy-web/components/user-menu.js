define('percy-web/components/user-menu', ['exports', 'percy-web/mixins/target-application-actions'], function (exports, _targetApplicationActions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend(_targetApplicationActions.default, {
    classNames: ['UserMenu'],
    showMenu: false,
    click: function click() {
      this.toggleProperty('showMenu');
    }
  });
});