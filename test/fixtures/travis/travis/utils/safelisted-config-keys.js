define('travis/utils/safelisted-config-keys', ['exports', 'npm:lodash.intersection', 'travis/utils/keys-map'], function (exports, _npmLodash, _keysMap) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = safelistedConfigKeys;
  function safelistedConfigKeys(config) {
    if (!config) {
      return [];
    }
    return (0, _npmLodash.default)([Object.keys(config), Object.keys(_keysMap.default)]);
  }
});