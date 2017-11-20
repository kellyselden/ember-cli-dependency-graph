define('code-corps-ember/components/skill-button', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var not = Ember.computed.not;
  var set = Ember.set;
  var get = Ember.get;
  var computed = Ember.computed;
  exports.default = Component.extend({
    alwaysShowX: false,
    attributeBindings: ['isLoading:disabled'],
    classNames: ['has-spinner', 'skill'],
    classNameBindings: ['isHovering:can-delete', 'size', 'type'],
    hasCheck: false,
    iconAfter: not('iconBefore'),
    iconBefore: true,
    isHovering: false,
    size: 'large',
    tagName: 'button',

    click: function click() {
      get(this, 'remove')();
    },
    mouseEnter: function mouseEnter() {
      set(this, 'isHovering', true);
    },
    mouseLeave: function mouseLeave() {
      set(this, 'isHovering', false);
    },


    /**
      @property spanClass
      @type String
     */
    spanClass: computed('isLoading', 'isHovering', function () {
      if (get(this, 'isLoading')) {
        return 'button-spinner';
      } else if (get(this, 'alwaysShowX') || get(this, 'isHovering')) {
        return 'x-mark';
      } else if (get(this, 'hasCheck')) {
        return 'check-mark';
      }
    })
  });
});