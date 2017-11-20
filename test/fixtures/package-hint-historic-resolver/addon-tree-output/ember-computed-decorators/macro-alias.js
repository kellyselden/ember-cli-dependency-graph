define('ember-computed-decorators/macro-alias', ['exports', 'ember-computed-decorators/utils/is-descriptor'], function (exports, _emberComputedDecoratorsUtilsIsDescriptor) {
  exports['default'] = macroAlias;

  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

  function handleDescriptor(target, property, desc, fn) {
    var params = arguments.length <= 4 || arguments[4] === undefined ? [] : arguments[4];

    return {
      enumerable: desc.enumerable,
      configurable: desc.configurable,
      writable: desc.writable,
      initializer: function initializer() {
        return fn.apply(undefined, _toConsumableArray(params));
      }
    };
  }

  function macroAlias(fn) {
    return function () {
      for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
        params[_key] = arguments[_key];
      }

      if ((0, _emberComputedDecoratorsUtilsIsDescriptor['default'])(params[params.length - 1])) {
        return handleDescriptor.apply(undefined, params.concat([fn]));
      } else {
        return function (target, property, desc) {
          return handleDescriptor(target, property, desc, fn, params);
        };
      }
    };
  }
});