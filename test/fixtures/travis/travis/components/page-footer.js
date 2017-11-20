define('travis/components/page-footer', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var service = Ember.inject.service;
  var Component = Ember.Component;
  exports.default = Component.extend({
    features: service(),
    tagName: 'footer',
    classNames: ['footer']
  });
});