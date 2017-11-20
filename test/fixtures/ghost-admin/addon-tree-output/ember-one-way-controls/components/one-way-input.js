define('ember-one-way-controls/components/one-way-input', ['exports', 'ember-invoke-action', 'ember-one-way-controls/-private/dynamic-attribute-bindings'], function (exports, _emberInvokeAction, _dynamicAttributeBindings) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component,
      assert = Ember.assert,
      computed = Ember.computed,
      _get = Ember.get,
      isNone = Ember.isNone,
      schedule = Ember.run.schedule;


  var FORBIDDEN_TYPES = ['checkbox', 'radio'];

  var OneWayInputComponent = Component.extend(_dynamicAttributeBindings.default, {
    tagName: 'input',

    attributeBindings: ['type', '_value:value'],

    NON_ATTRIBUTE_BOUND_PROPS: ['keyEvents', 'classNames', 'positionalParamValue', 'update'],

    keyEvents: {
      '13': 'onenter',
      '27': 'onescape'
    },

    change: function change(event) {
      this._processNewValue(event.target.value);
    },
    input: function input(event) {
      this._processNewValue(event.target.value);
    },
    _processNewValue: function _processNewValue(value) {
      if (_get(this, '_value') !== value) {
        (0, _emberInvokeAction.invokeAction)(this, 'update', value);
      }

      schedule('afterRender', this, '_syncValue');
    },
    _syncValue: function _syncValue() {
      if (this.isDestroyed || this.isDestroying) {
        return;
      }

      var actualValue = _get(this, '_value');
      var renderedValue = this.readDOMAttr('value');

      if (!isNone(actualValue) && !isNone(renderedValue) && actualValue.toString() !== renderedValue.toString()) {
        var rawElement = this.element;

        var start = void 0;
        var end = void 0;

        // gaurds because only text, search, url, tel and password support this
        try {
          start = rawElement.selectionStart;
          end = rawElement.selectionEnd;
        } catch (e) {
          // no-op
        }

        rawElement.value = actualValue;

        try {
          rawElement.setSelectionRange(start, end);
        } catch (e) {
          // no-op
        }
      }
    },
    keyUp: function keyUp(event) {
      var method = _get(this, 'keyEvents.' + event.keyCode);
      if (method) {
        (0, _emberInvokeAction.invokeAction)(this, method, event.target.value);
      }
    },


    type: computed({
      get: function get() {
        return 'text';
      },
      set: function set(key, type) {
        assert('The {{one-way-input}} component does not support type="' + type + '", use {{one-way-' + type + '}} instead.', FORBIDDEN_TYPES.indexOf(type) === -1);
        return type;
      }
    }),

    _value: computed('positionalParamValue', 'value', {
      get: function get() {
        var value = _get(this, 'positionalParamValue');
        if (value === undefined) {
          value = _get(this, 'value');
        }

        return value;
      }
    })
  });

  OneWayInputComponent.reopenClass({
    positionalParams: ['positionalParamValue']
  });

  exports.default = OneWayInputComponent;
});