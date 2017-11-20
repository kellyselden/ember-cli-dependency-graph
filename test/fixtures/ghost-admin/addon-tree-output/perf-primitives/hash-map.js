define('perf-primitives/hash-map', ['exports', 'perf-primitives/empty-object', 'perf-primitives/-constants'], function (exports, _emptyObject, _constants) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var HashMap = function () {
    function HashMap(entries) {
      _classCallCheck(this, HashMap);

      this._data = new _emptyObject.default();

      if (entries) {
        for (var i = 0; i < entries.length; i++) {
          this.data[entries[i][0]] = entries[i][1];
        }
      }
    }

    _createClass(HashMap, [{
      key: 'forEach',
      value: function forEach(cb) {
        for (var key in this._data) {
          // skip undefined
          if (this._data[key] !== _constants.UNDEFINED_KEY) {
            cb(this._data[key], key);
          }
        }

        return this;
      }
    }, {
      key: 'get',
      value: function get(key) {
        var val = this._data[key];

        return val === _constants.UNDEFINED_KEY ? undefined : val;
      }
    }, {
      key: 'set',
      value: function set(key, value) {
        this._data[key] = value;

        return this;
      }
    }, {
      key: 'delete',
      value: function _delete(key) {
        this._data[key] = _constants.UNDEFINED_KEY;

        return true;
      }
    }]);

    return HashMap;
  }();

  exports.default = HashMap;
});