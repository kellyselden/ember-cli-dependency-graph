define('ember-decorators/utils/decorator-wrappers', ['exports', 'ember-decorators/utils/is-descriptor'], function (exports, _isDescriptor) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.decorator = decorator;
  exports.decoratorWithParams = decoratorWithParams;


  function handleDescriptor(target, key, desc, fn) {
    var params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

    return {
      enumerable: desc.enumerable,
      configurable: desc.configurable,
      writeable: desc.writeable,
      value: fn(target, key, desc, params)
    };
  }

  function decorator(fn) {
    return function () {
      for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
        params[_key] = arguments[_key];
      }

      return handleDescriptor.apply(undefined, Array.prototype.slice.call(arguments).concat([fn, params]));
    };
  }

  function decoratorWithParams(fn) {
    return function () {
      for (var _len2 = arguments.length, params = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        params[_key2] = arguments[_key2];
      }

      // determine if user called as @computed('blah', 'blah') or @computed
      if ((0, _isDescriptor.default)(params[params.length - 1])) {
        return handleDescriptor.apply(undefined, Array.prototype.slice.call(arguments).concat([fn]));
      } else {
        return function () /* target, key, desc */{
          return handleDescriptor.apply(undefined, Array.prototype.slice.call(arguments).concat([fn, params]));
        };
      }
    };
  }
});