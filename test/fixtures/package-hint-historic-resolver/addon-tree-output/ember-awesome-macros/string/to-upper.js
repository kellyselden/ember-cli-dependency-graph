define('ember-awesome-macros/string/to-upper', ['exports', 'ember-awesome-macros/string/-utils'], function (exports, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = (0, _utils.normalizeString)(function (val) {
    return val.toUpperCase();
  });
});