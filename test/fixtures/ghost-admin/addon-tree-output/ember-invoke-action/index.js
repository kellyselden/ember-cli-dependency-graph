define('ember-invoke-action/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var assert = Ember.assert,
      get = Ember.get;


  var makeInvokeAction = function makeInvokeAction() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$strict = _ref.strict,
        strict = _ref$strict === undefined ? false : _ref$strict;

    return function (object, actionName) {
      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      assert('The first argument passed to invokeAction must be an object', (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object');

      var action = void 0;
      if (typeof actionName === 'string') {
        action = get(object, actionName);
      } else if (typeof actionName === 'function') {
        action = actionName;
      } else {
        assert('The second argument passed to invokeAction must be a string as actionName or a function', false);
      }

      if (typeof action === 'string') {
        object.sendAction.apply(object, [actionName].concat(args));
      } else if (typeof action === 'function') {
        return action.apply(undefined, args);
      } else if (strict) {
        assert('No invokable action ' + actionName + ' was found', false);
      }
    };
  };

  var getActions = function getActions(object) {
    return object._actions ? object._actions : object.actions;
  };

  var makeInvoke = function makeInvoke() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref2$strict = _ref2.strict,
        strict = _ref2$strict === undefined ? false : _ref2$strict;

    return function (object, actionName) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      var actions = getActions(object);
      var action = actions && actions[actionName];

      if (typeof action === 'function') {
        return action.call.apply(action, [object].concat(args));
      } else if (strict) {
        assert('No invokable action ' + actionName + ' was found', false);
      }
    };
  };

  var _invokeAction = makeInvokeAction();
  exports.invokeAction = _invokeAction;
  var _strictInvokeAction = makeInvokeAction({ strict: true });

  exports.strictInvokeAction = _strictInvokeAction;
  var _invoke = makeInvoke();
  exports.invoke = _invoke;
  var _strictInvoke = makeInvoke({ strict: true });

  exports.strictInvoke = _strictInvoke;
  var InvokeActionMixin = exports.InvokeActionMixin = Ember.Mixin.create({
    invokeAction: function invokeAction() {
      return _invokeAction.apply(undefined, [this].concat(Array.prototype.slice.call(arguments)));
    },
    strictInvokeAction: function strictInvokeAction() {
      return _strictInvokeAction.apply(undefined, [this].concat(Array.prototype.slice.call(arguments)));
    },
    invoke: function invoke() {
      return _invoke.apply(undefined, [this].concat(Array.prototype.slice.call(arguments)));
    },
    strictInvoke: function strictInvoke() {
      return _strictInvoke.apply(undefined, [this].concat(Array.prototype.slice.call(arguments)));
    }
  });

  exports.default = _invokeAction;
});