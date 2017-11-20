define('ember-macro-helpers/computed-unsafe', ['exports', 'ember-macro-helpers/-build-computed', 'ember-macro-helpers/get-value-unsafe', 'ember-macro-helpers/flatten-keys-unsafe'], function (exports, _buildComputed, _getValueUnsafe, _flattenKeysUnsafe) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var collapseKeys = function collapseKeys(keys) {
    return keys;
  };

  exports.default = (0, _buildComputed.default)({ collapseKeys: collapseKeys, getValue: _getValueUnsafe.default, flattenKeys: _flattenKeysUnsafe.default });
});