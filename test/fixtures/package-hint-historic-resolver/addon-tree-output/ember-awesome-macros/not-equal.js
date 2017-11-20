define('ember-awesome-macros/not-equal', ['exports', 'ember-awesome-macros/not', 'ember-awesome-macros/eq'], function (exports, _not, _eq) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function () {
    return (0, _not.default)(_eq.default.apply(undefined, arguments));
  };
});