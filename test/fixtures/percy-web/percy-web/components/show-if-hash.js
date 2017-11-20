define('percy-web/components/show-if-hash', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed;
  var Component = Ember.Component;
  exports.default = Component.extend({
    hash: null,

    isVisible: computed('hash', function () {
      return '#' + this.get('hash') === location.hash;
    })
  });
});