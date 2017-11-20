define('ember-awesome-macros/parse-int', ['exports', 'ember-macro-helpers/curried-computed', 'ember-awesome-macros/-utils'], function (exports, _curriedComputed, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = (0, _curriedComputed.default)((0, _utils.checkArgs)(parseInt));
});