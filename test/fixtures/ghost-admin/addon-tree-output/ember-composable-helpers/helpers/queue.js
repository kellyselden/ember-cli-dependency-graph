define('ember-composable-helpers/helpers/queue', ['exports', 'ember-composable-helpers/utils/is-promise'], function (exports, _isPromise) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.queue = queue;
  var helper = Ember.Helper.helper;
  function queue() {
    var actions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var invokeWithArgs = function invokeWithArgs(acc, curr) {
        if ((0, _isPromise.default)(acc)) {
          return acc.then(function () {
            return curr.apply(undefined, args);
          });
        }

        return curr.apply(undefined, args);
      };

      return actions.reduce(function (acc, curr, idx) {
        if (idx === 0) {
          return curr.apply(undefined, args);
        }

        return invokeWithArgs(acc, curr);
      }, undefined);
    };
  }

  exports.default = helper(queue);
});