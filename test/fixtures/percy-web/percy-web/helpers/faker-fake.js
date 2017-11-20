define('percy-web/helpers/faker-fake', ['exports', 'ember-fakerjs/helpers/faker-fake'], function (exports, _fakerFake) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _fakerFake.default;
    }
  });
  Object.defineProperty(exports, 'fakerFake', {
    enumerable: true,
    get: function () {
      return _fakerFake.fakerFake;
    }
  });
});