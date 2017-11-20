define('ember-keyboard/utils/get-code', ['exports', 'ember-keyboard/fixtures/code-map'], function (exports, _codeMap) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = getCode;
  function getCode(event) {
    return event.code || _codeMap.default[event.keyCode];
  }
});