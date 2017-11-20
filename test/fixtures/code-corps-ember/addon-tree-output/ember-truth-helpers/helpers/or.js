define('ember-truth-helpers/helpers/or', ['exports', 'ember-truth-helpers/utils/truth-convert'], function (exports, _emberTruthHelpersUtilsTruthConvert) {
  exports.orHelper = orHelper;

  function orHelper(params) {
    for (var i = 0, len = params.length; i < len; i++) {
      if ((0, _emberTruthHelpersUtilsTruthConvert['default'])(params[i]) === true) {
        return params[i];
      }
    }
    return params[params.length - 1];
  }
});