define("ember-i18n/utils/add-translations", ["exports", "ember"], function (exports, _ember) {
  exports["default"] = addTranslations;

  var assign = _ember["default"].assign || _ember["default"].merge;

  function addTranslations(locale, newTranslations, owner) {
    var key = "locale:" + locale + "/translations";
    var factory = owner.factoryFor(key);
    var existingTranslations = factory && factory["class"];

    if (existingTranslations == null) {
      existingTranslations = {};
      owner.register(key, existingTranslations);
    }

    assign(existingTranslations, newTranslations);
  }
});