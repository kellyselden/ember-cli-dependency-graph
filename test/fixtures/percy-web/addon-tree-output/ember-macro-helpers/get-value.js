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

    if (isBlank(macro)) {
      // the macro was `[]' or `@each.key', which has been trimmed, leaving a
      // blank string, so return the context (which is likely an ArrayProxy)
      return context;
    }

    return get(context, macro);
  };

  var get = Ember.get;
  var isBlank = Ember.isBlank;
});