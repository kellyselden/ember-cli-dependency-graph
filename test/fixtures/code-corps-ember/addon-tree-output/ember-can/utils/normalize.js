define("ember-can/utils/normalize", ["exports", "ember"], function (exports, _ember) {
  exports.normalizeCombined = normalizeCombined;

  var classify = _ember["default"].String.classify;

  var stopwords = ["of", "in", "for", "to", "from", "on"];

  function normalizeCombined(str) {
    var parts = str.split(' ');

    var abilityName = parts.pop();

    var last = parts[parts.length - 1];
    if (stopwords.indexOf(last) !== -1) {
      parts.pop();
    }

    var propertyName = normalizeAbilityMethod(parts.join(" "));

    return {
      propertyName: propertyName, abilityName: abilityName
    };
  }

  function normalizeAbilityMethod(str) {
    return 'can' + classify(str);
  }
});