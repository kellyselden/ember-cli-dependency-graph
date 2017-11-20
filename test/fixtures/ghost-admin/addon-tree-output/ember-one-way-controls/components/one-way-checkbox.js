define('ember-one-way-controls/components/one-way-checkbox', ['exports', 'ember-invoke-action', 'ember-one-way-controls/-private/dynamic-attribute-bindings'], function (exports, _emberInvokeAction, _dynamicAttributeBindings) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component,
      get = Ember.get,
      set = Ember.set;


  var OneWayCheckboxComponent = Component.extend(_dynamicAttributeBindings.default, {
    tagName: 'input',
    type: 'checkbox',

    NON_ATTRIBUTE_BOUND_PROPS: ['update'],

    attributeBindings: ['isChecked:checked', 'type', 'value'],

    didInsertElement: function didInsertElement() {
      var _this = this;

      this._super.apply(this, arguments);
      this.element.addEventListener('click', function (e) {
        return _this._click(e);
      });
    },
    didReceiveAttrs: function didReceiveAttrs() {
      this._super.apply(this, arguments);

      var value = get(this, 'paramChecked');
      if (value === undefined) {
        value = get(this, 'checked');
      }

      set(this, 'isChecked', value);
    },
    _click: function _click(event) {
      (0, _emberInvokeAction.invokeAction)(this, 'update', this.readDOMAttr('checked'), event);
    }
  });

  OneWayCheckboxComponent.reopenClass({
    positionalParams: ['paramChecked']
  });

  exports.default = OneWayCheckboxComponent;
});