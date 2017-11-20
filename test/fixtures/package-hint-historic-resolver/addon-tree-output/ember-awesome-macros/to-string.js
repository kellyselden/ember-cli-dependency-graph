define('ember-awesome-macros/to-string', ['exports', 'ember-awesome-macros/-utils'], function (exports, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = (0, _utils.safelyCreateComputed)('toString');
});