define('ember-decorators/utils/decorator-macros', ['exports', 'ember-decorators/utils/decorator-wrappers', 'ember-decorators/utils/extract-value'], function (exports, _decoratorWrappers, _extractValue) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.decoratorWithKeyReflection = decoratorWithKeyReflection;
  exports.decoratorWithRequiredParams = decoratorWithRequiredParams;
  exports.decoratedPropertyWithRequiredParams = decoratedPropertyWithRequiredParams;
  exports.decoratedPropertyWithOptionalCallback = decoratedPropertyWithOptionalCallback;

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

  function decoratorWithKeyReflection(fn) {
    return (0, _decoratorWrappers.decoratorWithParams)(function (target, key, desc, params) {
      if (params.length === 0) {
        return fn(key);
      }

      return fn.apply(undefined, _toConsumableArray(params));
    });
  }

  function decoratorWithRequiredParams(fn) {
    return (0, _decoratorWrappers.decoratorWithParams)(function (target, key, desc, params) {
      (true && !(params.length !== 0) && Ember.assert('Cannot use \'' + fn.name + '\' on field \'' + key + '\' without parameters', params.length !== 0));


      var value = (0, _extractValue.default)(desc);
      return fn.apply(undefined, _toConsumableArray(params).concat([value]));
    });
  }

  function decoratedPropertyWithRequiredParams(fn) {
    return (0, _decoratorWrappers.decoratorWithParams)(function (target, key, desc, params) {
      (true && !(params.length !== 0) && Ember.assert('Cannot use \'' + fn.name + '\' on field \'' + key + '\' without parameters', params.length !== 0));


      return fn.apply(undefined, _toConsumableArray(params));
    });
  }

  function decoratedPropertyWithOptionalCallback(fn) {
    return (0, _decoratorWrappers.decoratorWithParams)(function (target, key, desc, params) {
      (true && !(params.length !== 0) && Ember.assert('Cannot use \'' + fn.name + '\' on field \'' + key + '\' without parameters', params.length !== 0));


      if (typeof params[params.length - 1] === 'function') {
        return fn.apply(undefined, _toConsumableArray(params));
      }

      var value = (0, _extractValue.default)(desc);
      (true && !(typeof value === 'function') && Ember.assert('Cannot use \'' + fn.name + '\' on field \'' + key + '\' without a callback', typeof value === 'function'));


      return fn.apply(undefined, _toConsumableArray(params).concat([value]));
    });
  }
});