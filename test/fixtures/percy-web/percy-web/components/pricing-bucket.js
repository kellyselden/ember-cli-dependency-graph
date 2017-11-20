define('percy-web/components/pricing-bucket', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    plan: null,
    classes: null,
    promoted: false,

    classNames: ['PricingBucket'],
    classNameBindings: ['classes', 'promoted:PricingBucket--promoted'],
    actions: {}
  });
});