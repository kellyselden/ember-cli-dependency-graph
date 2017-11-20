define('code-corps-ember/components/donations/donation-amount-button', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    classNames: ['preset-amount'],
    classNameBindings: ['presetAmount', 'selected:default:clear'],
    tagName: 'button',
    presetAmount: 0
  });
});