define('code-corps-ember/helpers/float', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.float = float;

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

  var helper = Ember.Helper.helper;


  function convertToFloat(value) {
    return parseFloat(value);
  }

  /**
   * Used to convert a value to float. Should help if the value is, for example,
   * a string indicating a float
   *
   * @param  {String}  value   The value which could be a float or a string
   * @return {Number}          The value, in float
   */
  function float(_ref) {
    var _ref2 = _slicedToArray(_ref, 1),
        value = _ref2[0];

    return convertToFloat(value);
  }

  exports.default = helper(float);
});