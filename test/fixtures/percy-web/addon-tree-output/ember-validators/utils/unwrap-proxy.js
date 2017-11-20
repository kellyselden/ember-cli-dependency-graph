define('ember-validators/utils/unwrap-proxy', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = unwrapProxy;
  exports.isProxy = isProxy;
  var get = _ember['default'].get;

  function unwrapProxy(_x) {
    var _again = true;

    _function: while (_again) {
      var o = _x;
      _again = false;
      if (isProxy(o)) {
        _x = get(o, 'content');
        _again = true;
        continue _function;
      } else {
        return o;
      }
    }
  }

  function isProxy(o) {
    return !!(o && (o instanceof _ember['default'].ObjectProxy || o instanceof _ember['default'].ArrayProxy));
  }
});
/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */