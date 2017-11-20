define('ember-modal-dialog/components/tether-dialog', ['exports', 'ember-modal-dialog/components/basic-dialog', 'ember-modal-dialog/templates/components/tether-dialog'], function (exports, _basicDialog, _tetherDialog) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var dasherize = Ember.String.dasherize;
  var computed = Ember.computed;
  exports.default = _basicDialog.default.extend({
    layout: _tetherDialog.default,

    targetAttachmentClass: computed('targetAttachment', function () {
      var targetAttachment = this.get('targetAttachment') || '';
      return 'ember-modal-dialog-target-attachment-' + dasherize(targetAttachment);
    }),

    targetAttachment: null,
    attachment: null,
    didReceiveAttrs: function didReceiveAttrs() {
      this._super.apply(this, arguments);
      if (!this.get('attachment')) {
        this.set('attachment', 'middle center');
      }
      if (!this.get('targetAttachment')) {
        this.set('targetAttachment', 'middle center');
      }
    },

    tetherTarget: null, // element, css selector, view instance, 'viewport', or 'scroll-handle'
    tetherClassPrefix: computed({
      get: function get() {
        return 'ember-tether';
      },
      set: function set(key, val) {
        if (val) {
          return val;
        }
        return 'ember-tether';
      }
    })
    // offset - passed in
    // targetOffset - passed in
    // targetModifier - passed in
  });
});