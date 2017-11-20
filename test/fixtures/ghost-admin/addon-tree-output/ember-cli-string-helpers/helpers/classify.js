define('ember-cli-string-helpers/helpers/classify', ['exports', 'ember-helper', 'ember-string', 'ember-cli-string-helpers/-private/create-string-helper'], function (exports, _emberHelper, _emberString, _emberCliStringHelpersPrivateCreateStringHelper) {
  var classify = (0, _emberCliStringHelpersPrivateCreateStringHelper['default'])(_emberString.classify);
  exports.classify = classify;
  exports['default'] = (0, _emberHelper.helper)(classify);
});