define('ember-awesome-macros/html-safe', ['exports', 'ember-awesome-macros/-utils', 'ember-awesome-macros/string/html-safe'], function (exports, _utils, _htmlSafe) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = (0, _utils.deprecate)(_htmlSafe.default, 'htmlSafe', 'string.htmlSafe');
});