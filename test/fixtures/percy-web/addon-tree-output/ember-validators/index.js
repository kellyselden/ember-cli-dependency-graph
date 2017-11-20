define('ember-validators/index', ['exports', 'ember', 'ember-require-module'], function (exports, _ember, _emberRequireModule) {
  exports.validate = validate;
  var assert = _ember['default'].assert;
  var isPresent = _ember['default'].isPresent;

  function validate(type) {
    var validator = (0, _emberRequireModule['default'])('ember-validators/' + type);

    assert('Validator not found of type: ' + type + '.', isPresent(validator));

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return validator.apply(undefined, args);
  }
});
/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */