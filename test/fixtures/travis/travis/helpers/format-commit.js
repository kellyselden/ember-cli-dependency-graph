define('travis/helpers/format-commit', ['exports', 'travis/utils/format-commit'], function (exports, _formatCommit) {
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

  var htmlSafe = Ember.String.htmlSafe;
  var helper = Ember.Helper.helper;
  exports.default = helper(function (params) {
    var _params = _slicedToArray(params, 1),
        commit = _params[0];

    if (commit) {
      return new htmlSafe((0, _formatCommit.default)(commit.get('sha'), commit.get('branch')));
    }
  });
});