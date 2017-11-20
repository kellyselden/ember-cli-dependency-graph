define('ember-truth-helpers/helpers/and', ['exports', 'ember-truth-helpers/utils/truth-convert'], function (exports, _emberTruthHelpersUtilsTruthConvert) {
  exports.andHelper = andHelper;

  function andHelper(params) {
    for (var i = 0, len = params.length; i < len; i++) {
      if ((0, _emberTruthHelpersUtilsTruthConvert['default'])(params[i]) === false) {
        return params[i];
      }
    }
    return params[params.length - 1];
  }
});