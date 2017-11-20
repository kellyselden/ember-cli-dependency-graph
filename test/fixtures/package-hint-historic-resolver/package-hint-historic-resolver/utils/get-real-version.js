define('package-hint-historic-resolver/utils/get-real-version', ['exports', 'npm:semver'], function (exports, _npmSemver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = getRealVersion;

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

  function getRealVersion(versionHint, versions, dateCeiling) {
    if (!versions) {
      return;
    }

    versions = versions.filter(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          version = _ref2[0],
          date = _ref2[1];

      return _npmSemver.default.valid(version) && new Date(date) <= dateCeiling;
    }).map(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 1),
          version = _ref4[0];

      return version;
    });

    var realVersion = _npmSemver.default.maxSatisfying(versions, versionHint);

    return realVersion;
  }
});