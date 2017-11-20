define('ember-keyboard/listeners/key-events', ['exports', 'ember-keyboard/fixtures/code-map', 'ember-keyboard/utils/listener-name', 'ember-keyboard/fixtures/modifiers-array'], function (exports, _codeMap, _listenerName, _modifiersArray) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.keyDown = keyDown;
  exports.keyPress = keyPress;
  exports.keyUp = keyUp;


  var keyMapValues = Object.keys(_codeMap.default).map(function (key) {
    return _codeMap.default[key];
  });
  var validKeys = keyMapValues.concat(_modifiersArray.default);

  var validateKeys = function validateKeys(keys) {
    keys.forEach(function (key) {
      if (validKeys.indexOf(key) === -1) {
        /* eslint no-console: ["error", { allow: ["error"] }] */
        console.error('`' + key + '` is not a valid key name');
      }
    });
  };

  var formattedListener = function formattedListener(type, keysString) {
    var keys = keysString !== undefined ? keysString.split('+') : [];

    validateKeys(keys);

    return (0, _listenerName.default)(type, keys);
  };

  function keyDown(keys) {
    return formattedListener('keydown', keys);
  }

  function keyPress(keys) {
    return formattedListener('keypress', keys);
  }

  function keyUp(keys) {
    return formattedListener('keyup', keys);
  }
});