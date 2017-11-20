define('ember-i18n/config/pl', ['exports', 'ember-i18n/config/constants'], function (exports, _emberI18nConfigConstants) {
  exports['default'] = {
    rtl: false,

    pluralForm: function pluralForm(n) {
      var mod1 = n % 1;
      var mod10 = n % 10;
      var mod100 = n % 100;

      if (n === 1) {
        return _emberI18nConfigConstants.ONE;
      }
      if (mod1 === 0 && mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) {
        return _emberI18nConfigConstants.FEW;
      }
      if (mod1 === 0 && (mod10 === 0 || mod10 === 1 || mod10 >= 5 && mod10 <= 9 || mod100 >= 12 && mod100 <= 14)) {
        return _emberI18nConfigConstants.MANY;
      }
      return _emberI18nConfigConstants.OTHER;
    }
  };
});