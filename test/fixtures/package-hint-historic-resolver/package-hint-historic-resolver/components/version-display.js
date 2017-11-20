define('package-hint-historic-resolver/components/version-display', ['exports', 'ember-macro-helpers/raw', 'ember-awesome-macros'], function (exports, _raw, _emberAwesomeMacros) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;


  var MyComponent = Component.extend({
    classNames: ['version-display'],
    classNameBindings: ['areDifferent', 'isOneMissing:is-missing'],

    areDifferent: (0, _emberAwesomeMacros.conditional)('areVersionsDifferent', 'areVersionsDifferentClass', (0, _raw.default)(''))
  });

  MyComponent.reopenClass({
    positionalParams: ['version']
  });

  exports.default = MyComponent;
});