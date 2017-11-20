define('ember-feature-flags/services/features', ['exports', 'ember'], function (exports, _ember) {
  var camelize = _ember['default'].String.camelize;
  exports['default'] = _ember['default'].Service.extend({

    init: function init() {
      this._super.apply(this, arguments);
      this._flags = Object.create(null);

      this.setUnknownProperty = function (key) {
        throw new Error('Please use enable/disable to set feature flags. You attempted to set ' + key);
      };
    },

    setup: function setup(flags) {
      this._resetFlags();
      for (var flag in flags) {
        if (flags.hasOwnProperty(flag)) {
          if (!!flags[flag]) {
            this.enable(flag);
          } else {
            this.disable(flag);
          }
        }
      }
    },

    enable: function enable(flag) {
      var normalizedFlag = this._normalizeFlag(flag);
      this._flags[normalizedFlag] = true;
      this.notifyPropertyChange(normalizedFlag);
    },

    disable: function disable(flag) {
      var normalizedFlag = this._normalizeFlag(flag);
      this._flags[normalizedFlag] = false;
      this.notifyPropertyChange(normalizedFlag);
    },

    isEnabled: function isEnabled(feature) {
      var isEnabled = this._featureIsEnabled(feature);
      if (this._logFeatureFlagMissEnabled() && !isEnabled) {
        this._logFeatureFlagMiss(feature);
      }
      return isEnabled;
    },

    _resetFlags: function _resetFlags() {
      this._flags = Object.create(null);
    },

    _featureIsEnabled: function _featureIsEnabled(feature) {
      var normalizeFeature = this._normalizeFlag(feature);
      return this._flags[normalizeFeature] || false;
    },

    _logFeatureFlagMissEnabled: function _logFeatureFlagMissEnabled() {
      return !!this.get('config.LOG_FEATURE_FLAG_MISS');
    },

    _logFeatureFlagMiss: function _logFeatureFlagMiss(feature) {
      if (console && console.info) {
        console.info('Feature flag off:', feature);
      }
    },

    _normalizeFlag: function _normalizeFlag(flag) {
      return camelize(flag);
    },

    unknownProperty: function unknownProperty(key) {
      return this.isEnabled(key);
    }

  });
});