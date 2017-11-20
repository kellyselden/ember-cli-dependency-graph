define('ember-svg-jar/utils/make-helper', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = makeHelper;

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

  function makeHelper(helperFunc) {
    var helper = void 0;

    if (Ember.Helper && Ember.Helper.helper) {
      helper = Ember.Helper.helper(function (_ref, options) {
        var _ref2 = _slicedToArray(_ref, 1),
            assetId = _ref2[0];

        return helperFunc(assetId, options);
      });
    } else {
      helper = Ember.Handlebars.makeBoundHelper(function (assetId, options) {
        return helperFunc(assetId, options.hash || {});
      });
    }

    return helper;
  }
});