define('ember-truth-helpers/helpers/is-array', ['exports', 'ember'], function (exports, _ember) {
  exports.isArrayHelper = isArrayHelper;

  function isArrayHelper(params) {
    for (var i = 0, len = params.length; i < len; i++) {
      if (_ember['default'].isArray(params[i]) === false) {
        return false;
      }
    }
    return true;
  }
});