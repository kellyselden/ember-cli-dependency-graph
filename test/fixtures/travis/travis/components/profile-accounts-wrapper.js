define('travis/components/profile-accounts-wrapper', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    classNames: ['profile-orglist', 'columns', 'medium-4'],
    tagName: 'aside'
  });
});