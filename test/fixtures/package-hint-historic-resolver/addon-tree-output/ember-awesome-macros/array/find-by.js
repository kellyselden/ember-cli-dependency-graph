define('ember-awesome-macros/array/find-by', ['exports', 'ember-awesome-macros/array/-utils'], function (exports, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = (0, _utils.normalizeArray3)({
    firstDefault: function firstDefault() {
      return undefined;
    },
    func: 'findBy'
  });
});