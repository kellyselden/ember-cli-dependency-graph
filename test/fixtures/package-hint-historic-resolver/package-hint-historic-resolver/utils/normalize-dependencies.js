define('package-hint-historic-resolver/utils/normalize-dependencies', ['exports', 'lodash/toPairs'], function (exports, _toPairs) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = normalizeDependencies;

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

  var EmberObject = Ember.Object;
  var emberA = Ember.A;
  function normalizeDependencies(dependencies) {
    if (dependencies) {
      dependencies = (0, _toPairs.default)(dependencies).map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            module = _ref2[0],
            version = _ref2[1];

        return EmberObject.create({
          module: module,
          version: version
        });
      });
    } else {
      dependencies = [];
    }

    return emberA(dependencies);
  }
});