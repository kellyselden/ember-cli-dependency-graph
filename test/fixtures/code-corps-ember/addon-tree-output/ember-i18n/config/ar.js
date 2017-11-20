define('ember-i18n/config/ar', ['exports', 'ember-i18n/config/constants'], function (exports, _emberI18nConfigConstants) {
  exports['default'] = {
    rtl: true,

    pluralForm: function pluralForm(n) {
      var mod100 = n % 100;

      if (n === 0) {
        return _emberI18nConfigConstants.ZERO;
      }
      if (n === 1) {
        return _emberI18nConfigConstants.ONE;
      }
      if (n === 2) {
        return _emberI18nConfigConstants.TWO;
      }
      if (mod100 >= 3 && mod100 <= 10) {
        return _emberI18nConfigConstants.FEW;
      }
      if (mod100 >= 11 && mod100 <= 99) {
        return _emberI18nConfigConstants.MANY;
      }
      return _emberI18nConfigConstants.OTHER;
    }
  };
});