define('ember-changeset/utils/assign', ['exports', 'ember'], function (exports, _ember) {
  var _slice = Array.prototype.slice;
  exports['default'] = pureAssign;
  var merge = _ember['default'].merge;

  var assign = _ember['default'].assign || Object.assign || _assign;

  function _assign(origin) {
    for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      sources[_key - 1] = arguments[_key];
    }

    return sources.reduce(function (acc, source) {
      return merge(acc, source);
    }, merge({}, origin));
  }

  function pureAssign() {
    return assign.apply(undefined, [{}].concat(_slice.call(arguments)));
  }
});