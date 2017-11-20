define('ember-macro-helpers/collapse-keys', ['exports', 'ember-macro-helpers/collapse-key'], function (exports, _collapseKey) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.collapseKeysWithMap = collapseKeysWithMap;

  exports.default = function (keys) {
    return collapseKeysWithMap(keys).collapsedKeys;
  };

  function collapseKeysWithMap(keys) {
    var collapsedKeys = [];
    var keyMap = [];

    keys.forEach(function (key) {
      var array = (0, _collapseKey.default)(key);

      collapsedKeys = collapsedKeys.concat(array);

      var i = void 0;
      if (keyMap.length) {
        i = keyMap[keyMap.length - 1] + 1;
      } else {
        i = 0;
      }
      keyMap = keyMap.concat(array.map(function () {
        return i;
      }));
    });

    return {
      collapsedKeys: collapsedKeys,
      keyMap: keyMap
    };
  }
});