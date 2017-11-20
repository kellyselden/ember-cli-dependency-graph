define('ember-test-selectors/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = testSelector;
  var isNone = Ember.isNone,
      deprecate = Ember.deprecate;


  var message = 'Using the "testSelector" helper function is deprecated as it obfuscates the selectors, making the tests harder to understand.\nPlease use the actual attribute selectors instead, e.g. "[data-test-my-element]" instead of "testSelector(\'my-element\')".';

  function testSelector(key, value) {
    deprecate(message, false, {
      id: 'ember-test-selectors.test-selector-helper',
      until: '0.4.0',
      url: 'https://github.com/simplabs/ember-test-selectors#usage'
    });

    return isNone(value) ? '[data-test-' + key + ']' : '[data-test-' + key + '="' + value + '"]';
  }
});