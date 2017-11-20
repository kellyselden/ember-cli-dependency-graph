define('emberx-select/components/x-select', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var isArray = Ember.isArray,
      computed = Ember.computed;


  var isSelectedOption = function isSelectedOption(option) {
    return option.$().is(':selected');
  };

  /**
   * Wraps a native <select> element so that it can be object and
   * binding aware. It is used in conjuction with the
   * `x-option` component to construct select boxes. E.g.
   *
   *   {{#x-select value="bob" action="selectPerson"}}
   *     {{x-option value="fred"}}Fred Flintstone{{/x-option}}
   *     {{x-option value="bob"}}Bob Newhart{{/x-option}}
   *   {{/x-select}}
   *
   * the options are always up to date, so that when the object bound to
   * `value` changes, the corresponding option becomes selected.
   *
   * Whenever the select tag receives a change event, it will fire
   * `action`
   *
   * @class Ember.XSelectComponent
   * @extends Ember.Component
   */
  exports.default = Ember.Component.extend({
    tagName: "select",
    classNameBindings: [":x-select"],
    attributeBindings: ['disabled', 'tabindex', 'multiple', 'form', 'name', 'autofocus', 'required', 'size', 'title'],

    /**
     * Bound to the `disabled` attribute on the native <select> tag.
     *
     * @property disabled
     * @type Boolean
     * @default false
     */
    disabled: false,

    /**
     * Bound to the `multiple` attribute on the native <select> tag.
     *
     * @property multiple
     * @type Boolean
     * @default false
     */
    multiple: false,

    /**
     * The collection of options for this select box. When options are
     * rendered as a child from x-select, they will register themselves with their
     * containing `x-select`. This is for internal book-keeping only and should
     * not be changed from outside.
     *
     * @private
     * @property options
     */
    options: computed(function () {
      return Ember.A([]);
    }),

    /**
     * Bound to the `tabindex` attribute on the native <select> tag.
     *
     * @property tabindex
     * @type Integer
     * @default 0
     */
    tabindex: 0,

    /**
     * Function for the `on-blur` action
     *
     * @property on-blur
     * @type Function
     */
    "on-blur": function onBlur() {},


    /**
     * Function for the `on-click` action
     *
     * @property on-click
     * @type Function
     */
    "on-click": function onClick() {},


    /**
     * Function for the `on-change` action
     *
     * @property on-change
     * @type Function
     */
    "on-change": function onChange() {},


    /**
     * Function for the `on-focus-out` action
     *
     * @property on-focus-out
     * @type Function
     */
    "on-focus-out": function onFocusOut() {},


    /**
     * Function that calls an action and sends the proper arguments.
     *
     * @method _handleAction
     * @type Function
     * @param {String} action - string name of the action to invoke
     * @param {String|Object} value - current value of the component
     * @param {Object} event - jQuery event from the current action
     */
    _handleAction: function _handleAction(action, value, event) {
      var actionValue = this.get(action);

      if (typeof actionValue === 'string') {
        Ember.warn('x-select: You must use the action helper for all actions. The try: ' + action + '=(action "' + actionValue + '") in your template', false, { id: 'x-select-string-action' });
        return;
      }

      this.get(action)(value, event);
    },


    /**
     * When the select DOM event fires on the element, trigger the
     * component's action with the current value.
     */
    change: function change(event) {
      var nextValue = this._getValue();

      this.sendAction('action', nextValue, event, this);
      this._handleAction('on-change', nextValue, event);
    },


    /**
     * When the click DOM event fires on the element, trigger the
     * component's action with the component, x-select value, and the jQuery event.
     */
    click: function click(event) {
      this._handleAction('on-click', this._getValue(), event);
    },


    /**
     * When the blur DOM event fires on the element, trigger the
     * component's action with the component, x-select value, and the jQuery event.
     */
    blur: function blur(event) {
      this._handleAction('on-blur', this._getValue(), event);
    },


    /**
     * When the focusOut DOM event fires on the element, trigger the
     * component's action with the component, x-select value, and the jQuery event.
     */
    focusOut: function focusOut(event) {
      this._handleAction('on-focus-out', this._getValue(), event);
    },


    /**
     * Reads the current selection from this select's options.
     *
     * If this is a multi-select, then the value will be an
     * array. Otherwise, it will be a single value which could be null.
     *
     * @private
     * @return {Array|Object} the current selection
     */
    _getValue: function _getValue() {
      return this.get('multiple') ? this._findMultipleValues() : this._findSingleValue();
    },


    /**
     * Finds all selected values from all `x-option`
     * children. Used when this.get('multiple') === true
     *
     * @private
     * @return {Array} all the values from selected x-options
     */
    _findMultipleValues: function _findMultipleValues() {
      return this.get('options').filter(isSelectedOption).map(function (option) {
        return option.get('value');
      });
    },


    /**
     * Returns the value of the first selected `x-option`.
     * Used when `this.get('multiple') !== true`
     *
     * @private
     * @return {Object} the value of the first select `x-option`, or null
     */
    _findSingleValue: function _findSingleValue() {
      var selectedValue = this.get('options').find(isSelectedOption);
      return selectedValue ? selectedValue.get('value') : null;
    },


    /**
     * If no explicit value is set, apply default values based on selected=true in
     * the template.
     *
     * @private
     */
    _setDefaultValues: function _setDefaultValues() {
      Ember.run.once(this, this.__setDefaultValues);
    },

    __setDefaultValues: function __setDefaultValues() {
      var canSet = !this.isDestroying && !this.isDestroyed;
      if (canSet && this.get('value') == null) {
        this.sendAction('action', this._getValue());
      }
    },

    /**
     * @override
     */
    didInsertElement: function didInsertElement() {
      var _this = this;

      this._super.apply(this, arguments);

      this.$().on('blur', function (event) {
        _this.blur(event);
      });

      // FIXME this is an unfortunate workaround for an Edge bug for selects with required:
      // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8794503/
      if (/edge\//i.test(window.navigator.userAgent)) {
        var value = this.$().val();
        this.$().val(value + '-fake-edge-\uD83D\uDE33');
        this.$().val(value);
      }
    },


    /**
     * @override
     */
    willDestroyElement: function willDestroyElement() {
      this.$().off('blur');
      this._super.apply(this, arguments);
    },

    /**
     * If this is a multi-select, and the value is not an array, that
     * probably indicates a misconfiguration somewhere, so we error out.
     *
     * @private
     */
    ensureProperType: Ember.on('init', Ember.observer('value', function () {
      var value = this.get('value');

      if (value != null && this.get('multiple') && !isArray(value)) {
        throw new Error('x-select multiple=true was set, but value ' + value + ' is not enumerable.');
      }
    })),

    actions: {

      /**
       * Registers a new option that is contained within x-select.
       *
       * This is called whenever an x-option component is inserted into the DOM.
       *
       * @param {<x-option>} option - x-option component.
       * @private
       */
      registerOption: function registerOption(option) {
        this.get('options').push(option);
        this._setDefaultValues();
      },


      /**
       * Removes a the passed option that is contained within x-select.
       *
       * This is called whenever an x-option component is begining teardown.
       *
       * @param {<x-option>} option - x-option component.
       * @private
       */
      unregisterOption: function unregisterOption(option) {
        this.get('options').removeObject(option);
        this._setDefaultValues();
      }
    }
  });
});