define('ember-cli-string-helpers/helpers/underscore', ['exports', 'ember-helper', 'ember-string', 'ember-cli-string-helpers/-private/create-string-helper'], function (exports, _emberHelper, _emberString, _emberCliStringHelpersPrivateCreateStringHelper) {
  var underscore = (0, _emberCliStringHelpersPrivateCreateStringHelper['default'])(_emberString.underscore);
  exports.underscore = underscore;
  exports['default'] = (0, _emberHelper.helper)(underscore);
});