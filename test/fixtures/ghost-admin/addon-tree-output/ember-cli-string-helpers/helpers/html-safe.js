define('ember-cli-string-helpers/helpers/html-safe', ['exports', 'ember-helper', 'ember-string', 'ember-cli-string-helpers/-private/create-string-helper'], function (exports, _emberHelper, _emberString, _emberCliStringHelpersPrivateCreateStringHelper) {
  var htmlSafe = (0, _emberCliStringHelpersPrivateCreateStringHelper['default'])(_emberString.htmlSafe);
  exports.htmlSafe = htmlSafe;
  exports['default'] = (0, _emberHelper.helper)(htmlSafe);
});