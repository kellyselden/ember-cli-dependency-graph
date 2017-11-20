define('ember-keyboard/listeners/mouse-events', ['exports', 'ember-keyboard/utils/listener-name', 'ember-keyboard/fixtures/mouse-buttons-array', 'ember-keyboard/fixtures/modifiers-array'], function (exports, _listenerName, _mouseButtonsArray, _modifiersArray) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.click = click;
  exports.mouseDown = mouseDown;
  exports.mouseUp = mouseUp;


  var validKeys = _mouseButtonsArray.default.concat(_modifiersArray.default);

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

  function click(keys) {
    return formattedListener('click', keys);
  }

  function mouseDown(keys) {
    return formattedListener('mousedown', keys);
  }

  function mouseUp(keys) {
    return formattedListener('mouseup', keys);
  }
});