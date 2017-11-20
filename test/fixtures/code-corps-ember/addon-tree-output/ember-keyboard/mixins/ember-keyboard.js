define('ember-keyboard/mixins/ember-keyboard', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var service = Ember.inject.service;
  var Evented = Ember.Evented;
  var Mixin = Ember.Mixin;
  var get = Ember.get;
  exports.default = Mixin.create(Evented, {
    keyboardPriority: 0,

    keyboard: service(),

    init: function init() {
      get(this, 'keyboard').register(this);

      return this._super.apply(this, arguments);
    },
    willDestroyElement: function willDestroyElement() {
      this._super.apply(this, arguments);

      get(this, 'keyboard').unregister(this);
    },
    willDestroy: function willDestroy() {
      this._super.apply(this, arguments);

      get(this, 'keyboard').unregister(this);
    }
  });
});