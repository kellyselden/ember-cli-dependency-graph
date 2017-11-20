define('ember-macro-helpers/reads', ['exports', 'ember-macro-helpers/writable'], function (exports, _writable) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _writable.default;
    }
  });
});