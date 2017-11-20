define('ember-macro-helpers/-build-computed', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (_ref2) {
    var collapseKeys = _ref2.collapseKeys,
        getValue = _ref2.getValue,
        flattenKeys = _ref2.flattenKeys,
        isLazy = _ref2.isLazy;

    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var _parseComputedArgs = parseComputedArgs(args),
          keys = _parseComputedArgs.keys,
          incomingCallback = _parseComputedArgs.callback;

      var collapsedKeys = collapseKeys(keys);

      function createArgs(context, key) {
        var bundledKeys = collapsedKeys.map(function (macro) {
          return { context: context, macro: macro, key: key };
        });
        var values = void 0;
        if (isLazy) {
          values = bundledKeys.slice();
          values.splice(0, 0, getValue);
        } else {
          values = bundledKeys.map(getValue);
        }
        return values;
      }

      var newCallback = buildCallback({ incomingCallback: incomingCallback, createArgs: createArgs });

      return computed.apply(undefined, _toConsumableArray(flattenKeys(keys)).concat([newCallback]));
    };
  };

  exports.buildCurriedComputed = buildCurriedComputed;

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var computed = Ember.computed;


  function parseComputedArgs(args) {
    return {
      keys: args.slice(0, -1),
      callback: args[args.length - 1]
    };
  }

  function buildCallback(_ref) {
    var incomingCallback = _ref.incomingCallback,
        createArgs = _ref.createArgs;

    var newCallback = void 0;

    if (typeof incomingCallback === 'function') {
      newCallback = function newCallback(key) {
        return incomingCallback.apply(this, createArgs(this, key));
      };
    } else {
      newCallback = {};
      if (incomingCallback.get) {
        newCallback.get = function (key) {
          return incomingCallback.get.apply(this, createArgs(this, key));
        };
      }
      if (incomingCallback.set) {
        newCallback.set = function (key, value) {
          var _incomingCallback$set;

          return (_incomingCallback$set = incomingCallback.set).call.apply(_incomingCallback$set, [this, value].concat(_toConsumableArray(createArgs(this, key))));
        };
      }
    }

    return newCallback;
  }

  function buildCurriedComputed(computed) {
    return function (callback) {
      return function () {
        return computed.apply(undefined, Array.prototype.slice.call(arguments).concat([callback])).readOnly();
      };
    };
  }
});