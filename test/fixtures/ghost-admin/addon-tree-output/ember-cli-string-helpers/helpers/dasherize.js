define('ember-cli-string-helpers/helpers/dasherize', ['exports', 'ember-helper', 'ember-string', 'ember-cli-string-helpers/-private/create-string-helper'], function (exports, _emberHelper, _emberString, _emberCliStringHelpersPrivateCreateStringHelper) {
  var dasherize = (0, _emberCliStringHelpersPrivateCreateStringHelper['default'])(_emberString.dasherize);
  exports.dasherize = dasherize;
  exports['default'] = (0, _emberHelper.helper)(dasherize);
});