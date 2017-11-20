define('ember-macro-helpers/curried-computed', ['exports', 'ember-macro-helpers/-build-computed', 'ember-macro-helpers/computed'], function (exports, _buildComputed, _computed) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = (0, _buildComputed.buildCurriedComputed)(_computed.default);
});