define('code-corps-ember/components/select/country-select', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    classNames: ['select-country'],
    countryOptions: [{ name: 'United States', id: 'US' }]
  });
});