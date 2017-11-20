define('ember-awesome-macros/add', ['exports', 'ember-awesome-macros/sum'], function (exports, _sum) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _sum.default;
    }
  });
});