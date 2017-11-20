define('ember-keyboard/utils/get-key-code', ['exports', 'ember-keyboard/fixtures/code-map'], function (exports, _codeMap) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = getKeyCode;
  function getKeyCode(key) {
    return Object.keys(_codeMap.default).filter(function (keyCode) {
      return _codeMap.default[keyCode] === key;
    })[0];
  }
});