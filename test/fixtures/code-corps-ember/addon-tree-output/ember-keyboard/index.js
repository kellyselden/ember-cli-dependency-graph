define('ember-keyboard/index', ['exports', 'ember-keyboard/listeners/key-events', 'ember-keyboard/listeners/mouse-events', 'ember-keyboard/listeners/touch-events', 'ember-keyboard/initializers/ember-keyboard-first-responder-inputs', 'ember-keyboard/utils/trigger-event', 'ember-keyboard/utils/get-code', 'ember-keyboard/utils/get-key-code', 'ember-keyboard/utils/get-mouse-code', 'ember-keyboard/mixins/ember-keyboard', 'ember-keyboard/mixins/keyboard-first-responder-on-focus', 'ember-keyboard/mixins/activate-keyboard-on-focus', 'ember-keyboard/mixins/activate-keyboard-on-insert'], function (exports, _keyEvents, _mouseEvents, _touchEvents, _emberKeyboardFirstResponderInputs, _triggerEvent, _getCode, _getKeyCode, _getMouseCode, _emberKeyboard, _keyboardFirstResponderOnFocus, _activateKeyboardOnFocus, _activateKeyboardOnInsert) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.triggerKeyUp = exports.triggerKeyPress = exports.triggerKeyDown = exports.initialize = exports.touchEnd = exports.touchStart = exports.mouseUp = exports.mouseDown = exports.click = exports.keyPress = exports.keyUp = exports.keyDown = exports.getMouseCode = exports.getKeyCode = exports.getCode = exports.EKOnInsertMixin = exports.EKOnFocusMixin = exports.EKFirstResponderOnFocusMixin = exports.EKMixin = undefined;
  Object.defineProperty(exports, 'keyDown', {
    enumerable: true,
    get: function () {
      return _keyEvents.keyDown;
    }
  });
  Object.defineProperty(exports, 'keyUp', {
    enumerable: true,
    get: function () {
      return _keyEvents.keyUp;
    }
  });
  Object.defineProperty(exports, 'keyPress', {
    enumerable: true,
    get: function () {
      return _keyEvents.keyPress;
    }
  });
  Object.defineProperty(exports, 'click', {
    enumerable: true,
    get: function () {
      return _mouseEvents.click;
    }
  });
  Object.defineProperty(exports, 'mouseDown', {
    enumerable: true,
    get: function () {
      return _mouseEvents.mouseDown;
    }
  });
  Object.defineProperty(exports, 'mouseUp', {
    enumerable: true,
    get: function () {
      return _mouseEvents.mouseUp;
    }
  });
  Object.defineProperty(exports, 'touchStart', {
    enumerable: true,
    get: function () {
      return _touchEvents.touchStart;
    }
  });
  Object.defineProperty(exports, 'touchEnd', {
    enumerable: true,
    get: function () {
      return _touchEvents.touchEnd;
    }
  });
  Object.defineProperty(exports, 'initialize', {
    enumerable: true,
    get: function () {
      return _emberKeyboardFirstResponderInputs.initialize;
    }
  });
  Object.defineProperty(exports, 'triggerKeyDown', {
    enumerable: true,
    get: function () {
      return _triggerEvent.triggerKeyDown;
    }
  });
  Object.defineProperty(exports, 'triggerKeyPress', {
    enumerable: true,
    get: function () {
      return _triggerEvent.triggerKeyPress;
    }
  });
  Object.defineProperty(exports, 'triggerKeyUp', {
    enumerable: true,
    get: function () {
      return _triggerEvent.triggerKeyUp;
    }
  });
  exports.EKMixin = _emberKeyboard.default;
  exports.EKFirstResponderOnFocusMixin = _keyboardFirstResponderOnFocus.default;
  exports.EKOnFocusMixin = _activateKeyboardOnFocus.default;
  exports.EKOnInsertMixin = _activateKeyboardOnInsert.default;
  exports.getCode = _getCode.default;
  exports.getKeyCode = _getKeyCode.default;
  exports.getMouseCode = _getMouseCode.default;
});