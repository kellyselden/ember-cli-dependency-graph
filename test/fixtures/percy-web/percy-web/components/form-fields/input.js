define('percy-web/components/form-fields/input', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed;
  var get = Ember.get;
  var Component = Ember.Component;
  exports.default = Component.extend({
    changeset: null,
    title: null,
    property: null,
    type: 'text',
    autofocus: false,
    classes: null,

    classNames: ['FormFieldsInput'],
    classNameBindings: ['classes'],

    fieldErrors: computed('changeset.error', function () {
      return get(this.get('changeset.error'), this.get('property'));
    })
  });
});