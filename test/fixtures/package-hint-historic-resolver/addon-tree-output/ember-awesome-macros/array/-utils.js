define('ember-awesome-macros/array/-utils', ['exports', 'ember-macro-helpers/lazy-computed', 'ember-macro-helpers/normalize-array-key', 'ember-macro-helpers/create-class-computed'], function (exports, _lazyComputed, _normalizeArrayKey, _createClassComputed) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.normalizeArray = normalizeArray;
  exports.normalizeArray2 = normalizeArray2;
  exports.normalizeArray3 = normalizeArray3;

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var emberA = Ember.A;
  var ArrayProxy = Ember.ArrayProxy;


  var sentinelValue = {};

  function normalizeArrayArgs(keys) {
    keys[0] = (0, _normalizeArrayKey.default)(keys[0]);
  }

  function getDefaultValue(func, identityVal) {
    var val = func();
    return val === sentinelValue ? identityVal : val;
  }

  function normalizeArray(_ref, callback) {
    var _ref$defaultValue = _ref.defaultValue,
        defaultValue = _ref$defaultValue === undefined ? function () {
      return sentinelValue;
    } : _ref$defaultValue;

    return function () {
      for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
        keys[_key] = arguments[_key];
      }

      normalizeArrayArgs(keys);

      return _lazyComputed.default.apply(undefined, keys.concat([function (get, arrayKey) {
        var arrayVal = get(arrayKey);
        if (!arrayVal) {
          return getDefaultValue(defaultValue, arrayVal);
        }

        for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
          args[_key2 - 2] = arguments[_key2];
        }

        var values = args.map(get);
        return callback.call.apply(callback, [this, arrayVal].concat(_toConsumableArray(values)));
      }]));
    };
  }

  function normalizeArray2(funcStr) {
    var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
      return sentinelValue;
    };

    return function () {
      for (var _len3 = arguments.length, keys = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        keys[_key3] = arguments[_key3];
      }

      normalizeArrayArgs(keys);

      return _lazyComputed.default.apply(undefined, keys.concat([function (get, arrayKey) {
        for (var _len4 = arguments.length, args = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
          args[_key4 - 2] = arguments[_key4];
        }

        var arrayVal = get(arrayKey);
        var isArrayProxy = arrayVal instanceof ArrayProxy;
        if (!Array.isArray(arrayVal) && !isArrayProxy) {
          return getDefaultValue(defaultValue, arrayVal);
        }

        var emberArrayVal = void 0;
        if (isArrayProxy) {
          emberArrayVal = arrayVal;
        } else {
          emberArrayVal = emberA(arrayVal);
        }

        var prop = emberArrayVal[funcStr];
        if (typeof prop === 'function') {
          return prop.apply(emberArrayVal, args.map(get));
        }

        return prop;
      }]));
    };
  }

  function normalizeArray3(_ref2) {
    var _ref2$firstDefault = _ref2.firstDefault,
        firstDefault = _ref2$firstDefault === undefined ? function () {
      return sentinelValue;
    } : _ref2$firstDefault,
        _ref2$secondDefault = _ref2.secondDefault,
        secondDefault = _ref2$secondDefault === undefined ? function () {
      return sentinelValue;
    } : _ref2$secondDefault,
        func = _ref2.func;

    return (0, _createClassComputed.default)([false, true], function (array, key) {
      for (var _len5 = arguments.length, args = Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
        args[_key5 - 2] = arguments[_key5];
      }

      return _lazyComputed.default.apply(undefined, [(0, _normalizeArrayKey.default)(array, [key])].concat(args, [function (get, arrayKey) {
        var _emberArrayVal;

        var arrayVal = get(arrayKey);
        var isArrayProxy = arrayVal instanceof ArrayProxy;
        if (!Array.isArray(arrayVal) && !isArrayProxy) {
          return getDefaultValue(firstDefault, arrayVal);
        }
        if (typeof key !== 'string') {
          return getDefaultValue(secondDefault, arrayVal);
        }

        var emberArrayVal = void 0;
        if (isArrayProxy) {
          emberArrayVal = arrayVal;
        } else {
          emberArrayVal = emberA(arrayVal);
        }

        for (var _len6 = arguments.length, args = Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
          args[_key6 - 2] = arguments[_key6];
        }

        var resolvedArgs = [key].concat(_toConsumableArray(args.map(get)));
        if (typeof func === 'function') {
          return func.apply(undefined, [emberArrayVal].concat(_toConsumableArray(resolvedArgs)));
        }

        return (_emberArrayVal = emberArrayVal)[func].apply(_emberArrayVal, _toConsumableArray(resolvedArgs));
      }]));
    });
  }
});