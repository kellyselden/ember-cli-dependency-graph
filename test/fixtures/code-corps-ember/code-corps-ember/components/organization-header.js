define('code-corps-ember/components/organization-header', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    classNames: ['organization-header'],
    classNameBindings: ['expanded'],
    expanded: false
  });
});