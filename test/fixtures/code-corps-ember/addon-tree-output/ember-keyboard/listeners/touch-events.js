define('ember-keyboard/listeners/touch-events', ['exports', 'ember-keyboard/utils/listener-name', 'ember-keyboard/fixtures/modifiers-array'], function (exports, _listenerName, _modifiersArray) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.touchEnd = touchEnd;
  exports.touchStart = touchStart;


  var validateKeys = function validateKeys(keys) {
    keys.forEach(function (key) {
      if (_modifiersArray.default.indexOf(key) === -1) {
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

  function touchEnd(keys) {
    return formattedListener('touchEnd', keys);
  }

  function touchStart(keys) {
    return formattedListener('touchstart', keys);
  }
});