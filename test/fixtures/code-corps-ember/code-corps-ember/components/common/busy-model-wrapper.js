define('code-corps-ember/components/common/busy-model-wrapper', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    tagName: '',
    model: null,

    onSaving: 'Saving...',
    onDeleting: 'Deleting...'
  });
});