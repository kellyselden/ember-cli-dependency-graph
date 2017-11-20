define('ember-macro-helpers/writable', ['exports', 'ember-macro-helpers/computed'], function (exports, _computed) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (getter, setterCallback) {
    var newCallback = {
      get: function get(val) {
        return val;
      }
    };

    if (setterCallback) {
      if ((typeof setterCallback === 'undefined' ? 'undefined' : _typeof(setterCallback)) === 'object' && setterCallback.set) {
        newCallback.set = setterCallback.set;
      } else {
        newCallback.set = function () {
          return setterCallback.apply(this, arguments);
        };
      }
    }

    return (0, _computed.default)(getter, newCallback);
  };

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };
});