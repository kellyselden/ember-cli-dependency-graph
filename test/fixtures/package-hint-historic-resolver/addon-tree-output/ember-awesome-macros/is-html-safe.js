define('ember-awesome-macros/is-html-safe', ['exports', 'ember-awesome-macros/-utils', 'ember-awesome-macros/string/is-html-safe'], function (exports, _utils, _isHtmlSafe) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = (0, _utils.deprecate)(_isHtmlSafe.default, 'isHtmlSafe', 'string.isHtmlSafe');
});