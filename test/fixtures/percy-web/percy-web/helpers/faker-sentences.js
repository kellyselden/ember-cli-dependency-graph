define('percy-web/helpers/faker-sentences', ['exports', 'ember-fakerjs/helpers/faker-sentences'], function (exports, _fakerSentences) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _fakerSentences.default;
    }
  });
  Object.defineProperty(exports, 'fakerSentences', {
    enumerable: true,
    get: function () {
      return _fakerSentences.fakerSentences;
    }
  });
});