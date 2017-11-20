define('percy-web/components/saving-indicator', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    isSaving: null,
    isSaveSuccessful: null,

    tagName: 'span',
    classNames: ['SavingIndicator'],
    classes: null,
    classNameBindings: ['classes']
  });
});