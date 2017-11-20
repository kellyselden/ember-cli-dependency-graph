define('percy-docs/index', ['exports', 'percy-docs/markdownFiles'], function (exports, _markdownFiles) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    markdownFiles: _markdownFiles.default
  };
});