define('ember-composable-helpers/helpers/pipe', ['exports', 'ember-composable-helpers/utils/is-promise'], function (exports, _isPromise) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.invokeFunction = invokeFunction;
  exports.pipe = pipe;
  var helper = Ember.Helper.helper;
  function invokeFunction(acc, curr) {
    if ((0, _isPromise.default)(acc)) {
      return acc.then(curr);
    }

    return curr(acc);
  }

  function pipe() {
    var actions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return actions.reduce(function (acc, curr, idx) {
        if (idx === 0) {
          return curr.apply(undefined, args);
        }

        return invokeFunction(acc, curr);
      }, undefined);
    };
  }

  exports.default = helper(pipe);
});