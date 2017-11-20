define('travis/services/features', ['exports', 'ember-feature-flags/services/features', 'travis/config/environment'], function (exports, _features, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _features.default.extend({
    config: _environment.default,
    init: function init() {
      this._super.apply(this, arguments);

      if (_environment.default.featureFlags) {
        this.setup(_environment.default.featureFlags);
      }
    }
  });
});