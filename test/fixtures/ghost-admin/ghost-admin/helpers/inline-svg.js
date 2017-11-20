define('ghost-admin/helpers/inline-svg', ['exports', 'ember-inline-svg/helpers/inline-svg', 'ghost-admin/svgs'], function (exports, _inlineSvg, _svgs) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

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

  var helper = void 0;
  if (Ember.Helper && Ember.Helper.helper) {
    helper = Ember.Helper.helper(function (_ref, options) {
      var _ref2 = _slicedToArray(_ref, 1),
          path = _ref2[0];

      return (0, _inlineSvg.inlineSvg)(_svgs.default, path, options);
    });
  } else {
    helper = Ember.Handlebars.makeBoundHelper(function (path, options) {
      return (0, _inlineSvg.inlineSvg)(_svgs.default, path, options.hash || {});
    });
  }

  exports.default = helper;
});