define('ember-awesome-macros/computed', ['exports', 'ember-awesome-macros/-utils', 'ember-macro-helpers/computed'], function (exports, _utils, _computed) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = (0, _utils.deprecate)(_computed.default, 'computed', 'ember-macro-helpers/computed');
});