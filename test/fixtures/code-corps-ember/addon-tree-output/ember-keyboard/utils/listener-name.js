define('ember-keyboard/utils/listener-name', ['exports', 'ember-keyboard/utils/get-cmd-key'], function (exports, _getCmdKey) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = listenerName;


  function sortedKeys(keyArray) {
    return keyArray.sort().join('+');
  }

  function listenerName(type) {
    var keyArray = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    if (keyArray.indexOf('cmd') > -1) {
      keyArray[keyArray.indexOf('cmd')] = (0, _getCmdKey.default)();
    }

    var keys = keyArray.length === 0 ? '_all' : sortedKeys(keyArray);

    return type + ':' + keys;
  }
});