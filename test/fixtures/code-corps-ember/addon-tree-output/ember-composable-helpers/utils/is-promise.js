define('ember-composable-helpers/utils/is-promise', ['exports', 'ember-composable-helpers/utils/is-object'], function (exports, _isObject) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isPromise;
  var typeOf = Ember.typeOf;


  function isPromiseLike() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return typeOf(obj.then) === 'function' && typeOf(obj.catch) === 'function';
  }

  function isPromise(obj) {
    return (0, _isObject.default)(obj) && isPromiseLike(obj);
  }
});