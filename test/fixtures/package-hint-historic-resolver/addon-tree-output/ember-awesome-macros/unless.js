define('ember-awesome-macros/unless', ['exports', 'ember-awesome-macros'], function (exports, _emberAwesomeMacros) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (condition, expr1, expr2) {
    return (0, _emberAwesomeMacros.conditional)(condition, expr2, expr1);
  };
});