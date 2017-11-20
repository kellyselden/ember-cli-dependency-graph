define('ember-truth-helpers/helpers/not', ['exports', 'ember-truth-helpers/utils/truth-convert'], function (exports, _emberTruthHelpersUtilsTruthConvert) {
  exports.notHelper = notHelper;

  function notHelper(params) {
    for (var i = 0, len = params.length; i < len; i++) {
      if ((0, _emberTruthHelpersUtilsTruthConvert['default'])(params[i]) === true) {
        return false;
      }
    }
    return true;
  }
});