define('ember-macro-helpers/lazy-computed', ['exports', 'ember-macro-helpers/-build-computed', 'ember-macro-helpers/collapse-keys', 'ember-macro-helpers/get-value', 'ember-macro-helpers/flatten-keys'], function (exports, _buildComputed, _collapseKeys, _getValue, _flattenKeys) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = (0, _buildComputed.default)({ collapseKeys: _collapseKeys.default, getValue: _getValue.default, flattenKeys: _flattenKeys.default, isLazy: true });
});