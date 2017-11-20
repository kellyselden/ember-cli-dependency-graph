define('percy-web/components/form-fields/submit', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    // In this case, we pass classes through to the input element itself.
    classes: null,
    value: 'Submit',
    disabled: false,

    confirmationMessage: null,
    showSavingIndicator: true,
    isSaving: null,
    isSaveSuccessful: null,

    classNames: ['FormFieldsSubmit'],
    actions: {
      perform: function perform() {
        var confirmationMessage = this.get('confirmationMessage');
        if (confirmationMessage && !confirm(confirmationMessage)) {
          return;
        }
        this.get('submit')();
      }
    }
  });
});