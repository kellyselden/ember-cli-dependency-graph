define('liquid-wormhole/components/liquid-wormhole', ['exports', 'liquid-wormhole/templates/components/liquid-wormhole'], function (exports, _liquidWormhole) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed,
      inject = Ember.inject,
      generateGuid = Ember.generateGuid;
  var service = inject.service;
  var reads = computed.reads;
  exports.default = Ember.Component.extend({
    layout: _liquidWormhole.default,

    to: reads('destination'),
    liquidWormholeService: service('liquid-wormhole'),

    stack: computed(function () {
      return generateGuid();
    }),

    // Truthy value by default
    value: true,

    init: function init() {
      var wormholeClass = this.get('class');
      var wormholeId = this.get('stack') || this.get('id');

      this.set('wormholeClass', wormholeClass);
      this.set('wormholeId', wormholeId);

      if (Ember.typeOf(this.get('send')) !== 'function') {
        this.set('hasSend', true);
      }

      this._super.apply(this, arguments);
    },
    didUpdateAttrs: function didUpdateAttrs() {
      this._super.apply(this, arguments);
      this.get('liquidWormholeService').removeWormhole(this, this.get('to'));
      this.get('liquidWormholeService').appendWormhole(this, this.get('to'));
    },
    didInsertElement: function didInsertElement() {
      var nodes = this.$().children();
      this.set('nodes', nodes);

      this.element.className = 'liquid-wormhole-container';
      this.element.id = '';

      this.get('liquidWormholeService').appendWormhole(this, this.get('to'));

      this._super.apply(this, arguments);
    },
    willDestroyElement: function willDestroyElement() {
      this.get('liquidWormholeService').removeWormhole(this, this.get('to'));

      this._super.apply(this, arguments);
    }
  });
});