define('ember-awesome-macros/instance-of', ['exports', 'ember-macro-helpers/curried-computed'], function (exports, _curriedComputed) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = (0, _curriedComputed.default)(function (object, constructor) {
    if (constructor === undefined) {
      return undefined;
    }
    return object instanceof constructor;
  });
});