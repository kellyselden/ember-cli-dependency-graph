define('travis/mixins/build-favicon', ['exports', 'travis/utils/color-for-state', 'travis/utils/favicon-manager', 'travis/utils/favicon-data-uris'], function (exports, _colorForState, _faviconManager, _faviconDataUris) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Mixin = Ember.Mixin;
  exports.default = Mixin.create({
    actions: {
      faviconStateDidChange: function faviconStateDidChange(state) {
        if (state) {
          return this.setFaviconForState(state);
        } else {
          return this.setDefault();
        }
      }
    },

    init: function init() {
      this.faviconManager = new _faviconManager.default();
      return this._super.apply(this, arguments);
    },
    setFaviconForState: function setFaviconForState(state) {
      var color = (0, _colorForState.default)(state);
      return this.setFavicon((0, _faviconDataUris.default)(color));
    },
    setDefault: function setDefault() {
      return this.setFavicon((0, _faviconDataUris.default)('default'));
    },
    setFavicon: function setFavicon(href) {
      return this.faviconManager.setFavicon(href);
    }
  });
});