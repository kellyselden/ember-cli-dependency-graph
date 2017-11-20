define('ember-awesome-macros/array/sort', ['exports', 'ember-awesome-macros/array/-utils'], function (exports, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (array, sortDefinition) {
    var computedCallback = void 0;

    if (sortDefinition === undefined) {
      computedCallback = function computedCallback(array) {
        return array.slice().sort();
      };
    } else {
      computedCallback = function computedCallback(array, sortDefinition) {
        var sortCallback = void 0;

        if (typeof sortDefinition === 'function') {
          sortCallback = sortDefinition.bind(this);
        } else {
          sortCallback = function sortCallback(a, b) {
            var result = 0;

            // https://kangax.github.io/compat-table/es6/#test-generators
            // for (let key of sortDefinition) {
            for (var i = 0; i < sortDefinition.length; i++) {
              var key = sortDefinition[i];

              var _key$split = key.split(':'),
                  _key$split2 = _slicedToArray(_key$split, 2),
                  prop = _key$split2[0],
                  direction = _key$split2[1];

              result = compare(get(a, prop), get(b, prop));
              if (result !== 0) {
                if (direction === 'desc') {
                  result *= -1;
                }

                break;
              }
            }

            return result;
          };
        }

        return array.slice().sort(sortCallback);
      };
    }

    return (0, _utils.normalizeArray)({}, computedCallback)(array, sortDefinition);
  };

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  var get = Ember.get;
  var compare = Ember.compare;
});