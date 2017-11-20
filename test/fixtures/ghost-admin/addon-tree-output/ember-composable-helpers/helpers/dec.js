define('ember-composable-helpers/helpers/dec', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.dec = dec;

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
  var isEmpty = Ember.isEmpty;
  function dec(_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        step = _ref2[0],
        val = _ref2[1];

    if (isEmpty(val)) {
      val = step;
      step = undefined;
    }

    val = Number(val);

    if (isNaN(val)) {
      return;
    }

    if (step === undefined) {
      step = 1;
    }

    return val - step;
  }

  exports.default = helper(dec);
});