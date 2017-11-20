define('ember-cli-chai/qunit', ['exports', 'chai'], function (exports, _chai) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.withChai = withChai;


  /**
   * Returns a function that calls the passed in function with a wrapped
   * expect() and the original `assert` as parameters.
   */
  function withChai(fn) {
    return function (assert) {

      function _expect() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var assertion = _chai.expect.apply(undefined, args);
        var originalAssert = assertion.assert;
        assertion.assert = function () {
          var message = _chai.util.flag(assertion, 'message');

          try {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = arguments[_key2];
            }

            originalAssert.apply(this, args);
            assert.pushResult({ result: true, message: message });
          } catch (error) {
            assert.pushResult({
              result: false,
              actual: error.showDiff ? error.actual : undefined,
              expected: error.showDiff ? error.expected : undefined,
              message: error.message
            });
          }
        };
        return assertion;
      }

      return fn.call(this, _expect, assert);
    };
  }
});