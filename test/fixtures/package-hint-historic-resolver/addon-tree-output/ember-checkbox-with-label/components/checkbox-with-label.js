define('ember-checkbox-with-label/components/checkbox-with-label', ['exports', 'ember-checkbox-with-label/templates/components/checkbox-with-label'], function (exports, _checkboxWithLabel) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component,
      get = Ember.get;


  var MyComponent = Component.extend({
    layout: _checkboxWithLabel.default,

    tagName: 'label',

    classNames: ['checkbox-with-label'],

    actions: {
      toggleChecked: function toggleChecked() {
        var checked = get(this, 'checked');

        this.sendAction('update', !checked);
      }
    }
  });

  MyComponent.reopenClass({
    positionalParams: ['checked', 'text']
  });

  exports.default = MyComponent;
});