define('ember-awesome-macros/writable', ['exports', 'ember-awesome-macros/-utils', 'ember-macro-helpers/writable'], function (exports, _utils, _writable) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = (0, _utils.deprecate)(_writable.default, 'writable', 'ember-macro-helpers/writable');
});