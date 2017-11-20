define('ember-macro-helpers/get-value', ['exports', 'ember-macro-helpers/is-computed'], function (exports, _isComputed) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function () {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        context = _ref.context,
        macro = _ref.macro,
        key = _ref.key;

    if ((0, _isComputed.default)(macro)) {
      return macro._getter.call(context, key);
    }

    if (typeof macro !== 'string') {
      return macro;
    }

    return get(context, macro);
  };

  var get = Ember.get;
});