define('ember-cli-string-helpers/helpers/titleize', ['exports', 'ember-helper', 'ember-cli-string-helpers/utils/titleize', 'ember-cli-string-helpers/-private/create-string-helper'], function (exports, _emberHelper, _emberCliStringHelpersUtilsTitleize, _emberCliStringHelpersPrivateCreateStringHelper) {
  var titleize = (0, _emberCliStringHelpersPrivateCreateStringHelper['default'])(_emberCliStringHelpersUtilsTitleize['default']);
  exports.titleize = titleize;
  exports['default'] = (0, _emberHelper.helper)(titleize);
});