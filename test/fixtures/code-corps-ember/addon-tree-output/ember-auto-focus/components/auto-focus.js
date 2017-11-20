define('ember-auto-focus/components/auto-focus', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var scheduleOnce = Ember.run.scheduleOnce;


  var AutoFocusComponent = Component.extend({
    tagName: 'span',

    didInsertElement: function didInsertElement() {
      this._super.apply(this, arguments);
      scheduleOnce('afterRender', this, '_autofocus');
    },
    _autofocus: function _autofocus() {
      if (this.get('disabled')) {
        return false;
      }

      var selector = this.getWithDefault('selector', ':first-child');
      var child = this.get('element').querySelector(selector);

      if (child) {
        child.focus();
      }
    }
  });

  AutoFocusComponent.reopenClass({
    positionalParams: ['selector']
  });

  exports.default = AutoFocusComponent;
});