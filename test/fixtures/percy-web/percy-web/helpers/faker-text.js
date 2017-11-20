define('percy-web/helpers/faker-text', ['exports', 'ember-fakerjs/helpers/faker-text'], function (exports, _fakerText) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _fakerText.default;
    }
  });
  Object.defineProperty(exports, 'fakerText', {
    enumerable: true,
    get: function () {
      return _fakerText.fakerText;
    }
  });
});