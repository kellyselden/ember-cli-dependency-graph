define("ember-i18n/config/fr", ["exports", "ember-i18n/config/constants"], function (exports, _emberI18nConfigConstants) {
  exports["default"] = {
    rtl: false,

    pluralForm: function pluralForm(n) {
      if (n >= 0 && n < 2) {
        return _emberI18nConfigConstants.ONE;
      }
      return _emberI18nConfigConstants.OTHER;
    }
  };
});