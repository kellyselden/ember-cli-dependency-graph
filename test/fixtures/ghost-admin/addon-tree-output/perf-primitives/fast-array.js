define('perf-primitives/fast-array', ['exports', 'perf-primitives/-constants'], function (exports, _constants) {
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

  var FastArray = function () {
    function FastArray() {
      var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _constants.SMALL_ARRAY_LENGTH;
      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Unknown Pool';

      _classCallCheck(this, FastArray);

      this.init(length, name);
    }

    _createClass(FastArray, [{
      key: 'init',
      value: function init() {
        var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _constants.SMALL_ARRAY_LENGTH;
        var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Unknown Pool';

        this.name = name;
        this.length = 0;
        this._length = length;
        this._data = new Array(length);
      }
    }, {
      key: 'get',
      value: function get(index) {
        if (index >= 0 && index < this.length) {
          return this._data[index];
        }

        return undefined;
      }
    }, {
      key: 'set',
      value: function set(index, value) {
        if (index > this.length) {
          throw new Error("Index is out of array bounds.");
        }

        if (index === this.length) {
          this.length++;
        }

        this._data[index] = value;
      }
    }, {
      key: 'remove',
      value: function remove(index) {
        if (index > this.length - 1) {
          throw new Error("Index is out of array bounds.");
        }
        this._data[index] = _constants.UNDEFINED_KEY;
      }
    }, {
      key: 'forEach',
      value: function forEach(cb) {
        for (var i = 0; i < this.length; i++) {
          cb(this._data[i], i);
        }
      }
    }, {
      key: 'emptyEach',
      value: function emptyEach(cb) {
        for (var i = 0; i < this.length; i++) {
          if (this._data[i] !== _constants.UNDEFINED_KEY) {
            cb(this._data[i], i);
          }
          this._data[i] = undefined;
        }

        this.length = 0;
      }
    }, {
      key: 'empty',
      value: function empty() {
        for (var i = 0; i < this.length; i++) {
          this._data[i] = undefined;
        }

        this.length = 0;
      }
    }, {
      key: 'mapInPlace',
      value: function mapInPlace(cb) {
        for (var i = 0; i < this.length; i++) {
          if (this._data[i] !== _constants.UNDEFINED_KEY) {
            cb(this._data[i], i);
          }
        }
      }
    }, {
      key: 'map',
      value: function map(cb) {
        var arr = new FastArray(this._length, this.name);

        for (var i = 0, j = 0; i < this.length; i++, j++) {
          if (this._data[i] !== _constants.UNDEFINED_KEY) {
            arr._data[j] = cb(this._data[i], j);
          } else {
            j--;
          }
        }

        return arr;
      }
    }, {
      key: 'push',
      value: function push(item) {
        var index = this.length++;

        if (index === this._length) {
          this._length *= 2;
          this._data.length = this._length;
        }

        this._data[index] = item;

        return index;
      }
    }, {
      key: 'pop',
      value: function pop() {
        var index = --this.length;
        var v = void 0;

        if (index < 0) {
          this.length = 0;
          return undefined;
        }

        v = this._data[index];

        if (v === _constants.UNDEFINED_KEY) {
          return this.pop();
        }

        return v;
      }
    }]);

    return FastArray;
  }();

  exports.default = FastArray;
});