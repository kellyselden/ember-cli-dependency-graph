define('ember-awesome-macros/raw', ['exports', 'ember-awesome-macros/-utils', 'ember-macro-helpers/raw'], function (exports, _utils, _raw) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = (0, _utils.deprecate)(_raw.default, 'raw', 'ember-macro-helpers/raw');
});