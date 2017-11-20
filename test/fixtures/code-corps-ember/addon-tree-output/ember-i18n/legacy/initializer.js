define("ember-i18n/legacy/initializer", ["exports", "ember", "ember-i18n/legacy/stream", "ember-i18n/legacy/helper"], function (exports, _ember, _emberI18nLegacyStream, _emberI18nLegacyHelper) {

  // Used for Ember < 1.13
  exports["default"] = {
    name: 'ember-i18n-legacy-helper',

    initialize: function initialize(registry) {
      var i18n = registry.lookup('service:i18n');

      i18n.localeStream = new _emberI18nLegacyStream["default"](function () {
        return i18n.get('locale');
      });

      _ember["default"].addObserver(i18n, 'locale', i18n, function () {
        this.localeStream.value(); // force the stream to be dirty
        this.localeStream.notify();
      });

      _ember["default"].HTMLBars._registerHelper('t', _emberI18nLegacyHelper["default"]);
    }
  };
});