define('ember-one-way-controls/-private/dynamic-attribute-bindings', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Mixin = Ember.Mixin,
      set = Ember.set;
  exports.default = Mixin.create({
    NON_ATTRIBUTE_BOUND_PROPS: ['class', 'classNames'],
    concatenatedProperties: ['NON_ATTRIBUTE_BOUND_PROPS'],
    init: function init() {
      this._super.apply(this, arguments);

      var newAttributeBindings = [];
      for (var key in this.attrs) {
        if (this.NON_ATTRIBUTE_BOUND_PROPS.indexOf(key) === -1 && this.attributeBindings.indexOf(key) === -1) {
          newAttributeBindings.push(key);
        }
      }

      set(this, 'attributeBindings', this.attributeBindings.concat(newAttributeBindings));
    }
  });
});