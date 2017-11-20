define('ember-radio-button/components/radio-button-input', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component,
      computed = Ember.computed,
      isEqual = Ember.isEqual,
      run = Ember.run;
  exports.default = Component.extend({
    tagName: 'input',
    type: 'radio',

    // value - required
    // groupValue - required

    // autofocus - boolean
    // disabled - optional
    // name - optional
    // required - optional
    // radioClass - string
    // radioId - string
    // tabindex - number

    defaultLayout: null, // ie8 support

    attributeBindings: ['autofocus', 'checked', 'disabled', 'name', 'required', 'tabindex', 'type', 'value'],

    checked: computed('groupValue', 'value', function () {
      return isEqual(this.get('groupValue'), this.get('value'));
    }).readOnly(),

    sendChangedAction: function sendChangedAction() {
      this.sendAction('changed', this.get('value'));
    },
    change: function change() {
      var value = this.get('value');
      var groupValue = this.get('groupValue');

      if (groupValue !== value) {
        this.set('groupValue', value); // violates DDAU
        run.once(this, 'sendChangedAction');
      }
    }
  });
});