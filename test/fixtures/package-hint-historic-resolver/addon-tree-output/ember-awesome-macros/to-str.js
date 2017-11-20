define('ember-awesome-macros/to-str', ['exports', 'ember-awesome-macros/to-string'], function (exports, _toString) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _toString.default;
    }
  });
});