define('ember-cli-string-helpers/helpers/w', ['exports', 'ember-helper', 'ember-string'], function (exports, _emberHelper, _emberString) {
  exports.w = w;

  function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

  function w(_ref) {
    var _ref2 = _toArray(_ref);

    var wordStrings = _ref2;

    return wordStrings.map(_emberString.w).reduce(function (words, moreWords) {
      return words.concat(moreWords);
    });
  }

  exports['default'] = (0, _emberHelper.helper)(w);
});