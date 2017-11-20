define('ember-truth-helpers/helpers/lt', ['exports'], function (exports) {
  exports.ltHelper = ltHelper;

  function ltHelper(params, hash) {
    var left = params[0];
    var right = params[1];
    if (hash.forceNumber) {
      if (typeof left !== 'number') {
        left = Number(left);
      }
      if (typeof right !== 'number') {
        right = Number(right);
      }
    }
    return left < right;
  }
});