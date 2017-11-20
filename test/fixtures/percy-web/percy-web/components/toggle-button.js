define('percy-web/components/toggle-button', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed;
  var not = Ember.computed.not;
  var Component = Ember.Component;
  exports.default = Component.extend({
    object: null,
    enabled: false,
    classes: null,
    enabledText: 'Disable',
    disabledText: 'Enable',

    disabled: not('enabled'),
    tagName: 'button',
    classNames: ['ToggleButton', 'Button'],
    classNameBindings: ['enabled:Button--primary', 'classes'],

    text: computed('enabled', 'enabledText', 'disabledText', function () {
      if (this.get('enabled')) {
        return this.get('enabledText');
      } else {
        return this.get('disabledText');
      }
    }),

    click: function click() {
      this.sendAction('action', this.get('enabled'), this.get('object'));
    }
  });
});