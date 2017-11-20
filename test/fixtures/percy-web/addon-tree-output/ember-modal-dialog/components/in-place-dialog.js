define('ember-modal-dialog/components/in-place-dialog', ['exports', 'ember-modal-dialog/templates/components/in-place-dialog'], function (exports, _inPlaceDialog) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed;

  var computedJoin = function computedJoin(prop) {
    return computed(prop, function () {
      return this.get(prop).join(' ');
    });
  };

  exports.default = Ember.Component.extend({
    tagName: '',
    layout: _inPlaceDialog.default,

    containerClass: null, // passed in
    containerClassNames: ['ember-modal-dialog', 'ember-modal-dialog-in-place', 'emd-in-place'], // set this in a subclass definition
    containerClassNamesString: computedJoin('containerClassNames'),

    concatenatedProperties: ['containerClassNames']
  });
});