define('ember-cli-string-helpers/helpers/humanize', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.humanize = humanize;

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


  var regex = /_+|-+/g;
  var replacement = ' ';

  // The substituted value will be contained in the result variable
  function humanize(_ref) {
    var _ref2 = _slicedToArray(_ref, 1),
        string = _ref2[0];

    if (string === undefined || string === null) {
      return '';
    }

    var result = string.toLowerCase().replace(regex, replacement);
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

  exports.default = helper(humanize);
});