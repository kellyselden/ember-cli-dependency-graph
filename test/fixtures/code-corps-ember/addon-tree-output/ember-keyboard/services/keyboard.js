define('ember-keyboard/services/keyboard', ['exports', 'ember-keyboard/listeners/key-events', 'ember-keyboard/utils/handle-key-event'], function (exports, _keyEvents, _handleKeyEvent) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var $ = Ember.$;
  var Service = Ember.Service;
  var A = Ember.A;
  var getOwner = Ember.getOwner;
  var get = Ember.get;
  var getProperties = Ember.getProperties;
  var set = Ember.set;
  var computed = Ember.computed;
  var filter = Ember.computed.filter;
  var filterBy = Ember.computed.filterBy;
  var sort = Ember.computed.sort;
  var run = Ember.run;
  exports.default = Service.extend({
    isPropagationEnabled: false,

    registeredResponders: computed(function () {
      return A();
    }),

    activeResponders: filterBy('registeredResponders', 'keyboardActivated'),

    sortedRespondersSortDefinition: computed('isPropagationEnabled', function () {
      return get(this, 'isPropagationEnabled') ? ['keyboardPriority:desc'] : ['keyboardFirstResponder:desc', 'keyboardPriority:desc'];
    }),

    sortedResponders: sort('activeResponders', 'sortedRespondersSortDefinition'),

    firstResponders: filterBy('sortedResponders', 'keyboardFirstResponder'),

    normalResponders: filter('sortedResponders.@each.keyboardFirstResponder', function (responder) {
      return !get(responder, 'keyboardFirstResponder');
    }),

    init: function init() {
      var _this = this;

      this._super.apply(this, arguments);

      if (typeof FastBoot !== 'undefined') {
        return;
      }

      var config = getOwner(this).resolveRegistration('config:environment') || {};

      var isPropagationEnabled = Boolean(get(config, 'emberKeyboard.propagation'));
      set(this, 'isPropagationEnabled', isPropagationEnabled);

      var listeners = get(config, 'emberKeyboard.listeners') || ['keyUp', 'keyDown', 'keyPress', 'click', 'mouseDown', 'mouseUp', 'touchStart', 'touchEnd'];
      var eventNames = listeners.map(function (name) {
        return name.toLowerCase() + '.ember-keyboard-listener';
      }).join(' ');

      $(document).on(eventNames, null, function (event) {
        run(function () {
          if (get(_this, 'isPropagationEnabled')) {
            (0, _handleKeyEvent.handleKeyEventWithPropagation)(event, getProperties(_this, 'firstResponders', 'normalResponders'));
          } else {
            (0, _handleKeyEvent.handleKeyEventWithLaxPriorities)(event, get(_this, 'sortedResponders'));
          }
        });
      });
    },
    willDestroy: function willDestroy() {
      this._super.apply(this, arguments);

      if (typeof FastBoot !== 'undefined') {
        return;
      }

      $(document).off('.ember-keyboard-listener');
    },
    register: function register(responder) {
      get(this, 'registeredResponders').pushObject(responder);
    },
    unregister: function unregister(responder) {
      get(this, 'registeredResponders').removeObject(responder);
    },
    keyDown: function keyDown() {
      return _keyEvents.keyDown.apply(undefined, arguments);
    },
    keyPress: function keyPress() {
      return _keyEvents.keyPress.apply(undefined, arguments);
    },
    keyUp: function keyUp() {
      return _keyEvents.keyUp.apply(undefined, arguments);
    }
  });
});