define('ember-cli-string-helpers/helpers/camelize', ['exports', 'ember-helper', 'ember-string', 'ember-cli-string-helpers/-private/create-string-helper'], function (exports, _emberHelper, _emberString, _emberCliStringHelpersPrivateCreateStringHelper) {
  var camelize = (0, _emberCliStringHelpersPrivateCreateStringHelper['default'])(_emberString.camelize);
  exports.camelize = camelize;
  exports['default'] = (0, _emberHelper.helper)(camelize);
});