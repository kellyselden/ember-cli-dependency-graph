define('ember-awesome-macros/subtract', ['exports', 'ember-awesome-macros/difference'], function (exports, _difference) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _difference.default;
    }
  });
});