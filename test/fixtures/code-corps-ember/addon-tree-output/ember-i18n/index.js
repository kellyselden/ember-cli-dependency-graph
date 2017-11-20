define("ember-i18n/index", ["exports", "ember-i18n/utils/i18n/compile-template", "ember-i18n/services/i18n", "ember-i18n/utils/macro"], function (exports, _emberI18nUtilsI18nCompileTemplate, _emberI18nServicesI18n, _emberI18nUtilsMacro) {
  exports.compileTemplate = _emberI18nUtilsI18nCompileTemplate["default"];
  exports.Service = _emberI18nServicesI18n["default"];
  exports.translationMacro = _emberI18nUtilsMacro["default"];
});