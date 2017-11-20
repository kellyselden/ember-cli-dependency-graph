define('percy-web/helpers/faker-sentence', ['exports', 'ember-fakerjs/helpers/faker-sentence'], function (exports, _fakerSentence) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _fakerSentence.default;
    }
  });
  Object.defineProperty(exports, 'fakerSentence', {
    enumerable: true,
    get: function () {
      return _fakerSentence.fakerSentence;
    }
  });
});