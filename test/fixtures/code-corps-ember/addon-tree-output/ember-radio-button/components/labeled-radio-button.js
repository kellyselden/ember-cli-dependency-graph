define('ember-radio-button/components/labeled-radio-button', ['exports', 'ember-radio-button/templates/components/labeled-radio-button'], function (exports, _labeledRadioButton) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component,
      computed = Ember.computed,
      isEqual = Ember.isEqual;
  exports.default = Component.extend({
    tagName: 'label',
    layout: _labeledRadioButton.default,
    attributeBindings: ['for'],
    classNameBindings: ['checked'],
    classNames: ['ember-radio-button'],
    defaultLayout: null, // ie8 support

    checked: computed('groupValue', 'value', function () {
      return isEqual(this.get('groupValue'), this.get('value'));
    }).readOnly(),

    'for': computed.readOnly('radioId'),

    actions: {
      innerRadioChanged: function innerRadioChanged(value) {
        this.sendAction('changed', value);
      }
    }
  });
});