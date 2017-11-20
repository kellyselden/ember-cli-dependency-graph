define('ember-truth-helpers/utils/truth-convert', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = truthConvert;

  function truthConvert(result) {
    var truthy = result && _ember['default'].get(result, 'isTruthy');
    if (typeof truthy === 'boolean') {
      return truthy;
    }

    if (_ember['default'].isArray(result)) {
      return _ember['default'].get(result, 'length') !== 0;
    } else {
      return !!result;
    }
  }
});