define('ember-cli-flash/flash/object', ['exports', 'ember-cli-flash/utils/computed'], function (exports, _computed) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var EmberObject = Ember.Object,
      readOnly = Ember.computed.readOnly,
      _Ember$run = Ember.run,
      later = _Ember$run.later,
      cancel = _Ember$run.cancel,
      Evented = Ember.Evented,
      get = Ember.get,
      set = Ember.set;
  exports.default = EmberObject.extend(Evented, {
    timer: null,
    exitTimer: null,
    exiting: false,
    isExitable: true,
    initializedTime: null,

    queue: readOnly('flashService.queue'),
    _guid: _computed.default.guidFor('message').readOnly(),

    init: function init() {
      this._super.apply(this, arguments);

      if (get(this, 'sticky')) {
        return;
      }

      this._setTimer('timer', 'exitMessage', get(this, 'timeout'));
      this._setInitializedTime();
    },
    destroyMessage: function destroyMessage() {
      var queue = get(this, 'queue');

      if (queue) {
        queue.removeObject(this);
      }

      this.destroy();
      this.trigger('didDestroyMessage');
    },
    exitMessage: function exitMessage() {
      if (!get(this, 'isExitable')) {
        return;
      }
      this._setTimer('exitTimer', 'destroyMessage', get(this, 'extendedTimeout'));
      this._cancelTimer('timer');

      set(this, 'exiting', true);
      this.trigger('didExitMessage');
    },
    willDestroy: function willDestroy() {
      this._cancelAllTimers();

      var onDestroy = get(this, 'onDestroy');

      if (onDestroy) {
        onDestroy();
      }

      this._super.apply(this, arguments);
    },
    preventExit: function preventExit() {
      set(this, 'isExitable', false);
    },
    allowExit: function allowExit() {
      set(this, 'isExitable', true);
      this._checkIfShouldExit();
    },


    // private
    _setTimer: function _setTimer(name, methodName, timeout) {
      return set(this, name, later(this, methodName, timeout));
    },
    _setInitializedTime: function _setInitializedTime() {
      var currentTime = new Date().getTime();

      set(this, 'initializedTime', currentTime);
    },
    _getElapsedTime: function _getElapsedTime() {
      var currentTime = new Date().getTime();
      var initializedTime = get(this, 'initializedTime');

      return currentTime - initializedTime;
    },
    _cancelTimer: function _cancelTimer(name) {
      var timer = get(this, name);

      if (timer) {
        cancel(timer);
        set(this, name, null);
      }
    },
    _cancelAllTimers: function _cancelAllTimers() {
      var _this = this;

      var timers = ['timer', 'exitTimer'];

      timers.forEach(function (timer) {
        _this._cancelTimer(timer);
      });
    },
    _checkIfShouldExit: function _checkIfShouldExit() {
      if (this._getElapsedTime() >= get(this, 'timeout') && !get(this, 'sticky')) {
        this.exitMessage();
      }
    }
  });
});