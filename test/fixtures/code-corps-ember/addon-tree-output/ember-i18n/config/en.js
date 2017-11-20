define("ember-i18n/config/en", ["exports", "ember-i18n/config/constants"], function (exports, _emberI18nConfigConstants) {
  exports["default"] = {
    rtl: false,

    pluralForm: function pluralForm(n) {
      if (n === 1) {
        return _emberI18nConfigConstants.ONE;
      }
      return _emberI18nConfigConstants.OTHER;
    }
  };
});