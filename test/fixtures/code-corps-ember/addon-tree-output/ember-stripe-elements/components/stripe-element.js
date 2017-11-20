define('ember-stripe-elements/components/stripe-element', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var service = Ember.inject.service;
  var computed = Ember.computed;
  var get = Ember.get;
  var set = Ember.set;
  exports.default = Component.extend({
    classNames: ['ember-stripe-element'],

    autofocus: false,
    error: null,
    options: [],
    stripeElement: null,
    type: null, // Set in components that extend from `stripe-element`

    stripev3: service(),
    elements: computed(function () {
      return get(this, 'stripev3.elements')();
    }),

    didInsertElement: function didInsertElement() {
      this._super.apply(this, arguments);

      var elements = get(this, 'stripev3.elements')();

      // Fetch user options
      var options = get(this, 'options');

      // Fetch `type` set by child component
      var type = get(this, 'type');

      // `stripeElement` instead of `element` to distinguish from `this.element`
      var stripeElement = elements.create(type, options);

      // Mount the Stripe Element onto the mount point
      stripeElement.mount(this.element.querySelector('[role="mount-point"]'));

      // Make the element available to the component
      set(this, 'stripeElement', stripeElement);

      // Set the event listeners
      this.setEventListeners();
    },
    didRender: function didRender() {
      this._super.apply(this, arguments);
      // Fetch autofocus, set by user
      var autofocus = get(this, 'autofocus');
      var stripeElement = get(this, 'stripeElement');
      var $iframe = this.$('iframe')[0];
      if (autofocus && $iframe) {
        $iframe.onload = function () {
          stripeElement.focus();
        };
      }
    },
    didUpdateAttrs: function didUpdateAttrs() {
      this._super.apply(this, arguments);
      get(this, 'stripeElement').update(get(this, 'options'));
    },
    willDestroyElement: function willDestroyElement() {
      this._super.apply(this, arguments);
      get(this, 'stripeElement').unmount();
    },
    setEventListeners: function setEventListeners() {
      var _this = this;

      var stripeElement = get(this, 'stripeElement');
      stripeElement.on('blur', function (event) {
        return _this.sendAction('blur', stripeElement, event);
      });
      stripeElement.on('focus', function (event) {
        return _this.sendAction('focus', stripeElement, event);
      });
      stripeElement.on('change', function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var _args$ = args[0],
            error = _args$.error,
            complete = _args$.complete;

        set(_this, 'error', error);
        _this.sendAction.apply(_this, ['change', stripeElement].concat(args));

        if (complete) {
          _this.sendAction('complete', stripeElement);
        } else if (error) {
          _this.sendAction('error', error);
        }
      });
    }
  });
});