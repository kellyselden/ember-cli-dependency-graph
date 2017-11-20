define('travis/components/subscription-status-banner', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    tagName: 'p',
    classNameBindings: ['bannerColor'],
    bannerColor: function () {
      return 'notice-banner--' + this.color;
    }.property('bannerColor')
  });
});