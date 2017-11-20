define('ember-i18n/config/he', ['exports', 'ember-i18n/config/en'], function (exports, _emberI18nConfigEn) {
  exports['default'] = {
    rtl: true,

    pluralForm: _emberI18nConfigEn['default'].pluralForm
  };
});