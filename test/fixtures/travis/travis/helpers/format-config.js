define('travis/helpers/format-config', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.safeFormatConfig = safeFormatConfig;
  var helper = Ember.Helper.helper;
  var copy = Ember.copy;
  function safeFormatConfig(config) {
    var rejectKeys = ['.result', 'notifications', 'branches', 'linux_shared'];
    var rejectIfEmptyKeys = ['addons'];

    // create deep copy of config
    var deepCopy = copy(config[0] || {}, true);

    rejectKeys.forEach(function (keyToReject) {
      delete deepCopy[keyToReject];
    });

    rejectIfEmptyKeys.forEach(function (key) {
      if (deepCopy[key] && Object.keys(deepCopy[key]).length < 1) {
        delete deepCopy[key];
      }
    });

    return JSON.stringify(deepCopy, null, 2);
  }

  exports.default = helper(safeFormatConfig);
});