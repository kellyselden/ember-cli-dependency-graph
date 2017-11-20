define('percy-web/components/form-fields/checkbox', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed;
  var observer = Ember.observer;
  var get = Ember.get;
  var Component = Ember.Component;
  exports.default = Component.extend({
    changeset: null,
    title: null,
    property: null,

    // This "value" is what the changeset property value will be set to when checked.
    // To check the checkbox by default, set the changeset's property value to the same as this value.
    checkedValue: null,
    uncheckedValue: null,

    shouldBeChecked: computed('changeset.isPristine', 'checkedValue', function () {
      return this.get('changeset.' + this.get('property')) === this.get('checkedValue');
    }),
    // Update the checked property if the changeset changes.
    _updateChecked: observer('shouldBeChecked', function () {
      this.$('input').prop('checked', this.get('shouldBeChecked'));
    }),

    classes: null,
    classNames: ['FormFieldsCheckbox'],
    classNameBindings: ['classes'],

    fieldErrors: computed('changeset.error', function () {
      return get(this.get('changeset.error'), this.get('property'));
    }),
    actions: {
      updateValue: function updateValue(event) {
        if (event.target.checked) {
          this.set('changeset.' + this.get('property'), this.get('checkedValue'));
        } else {
          this.set('changeset.' + this.get('property'), this.get('uncheckedValue'));
        }
      }
    }
  });
});