define('percy-web/components/quickstart-button', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    classNames: ['QuickstartButton'],
    click: function click() {
      this.toggleProperty('showQuickstart');
    }
  });
});