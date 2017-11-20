define('ember-macro-helpers/lazy-curried-computed', ['exports', 'ember-macro-helpers/-build-computed', 'ember-macro-helpers/lazy-computed'], function (exports, _buildComputed, _lazyComputed) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = (0, _buildComputed.buildCurriedComputed)(_lazyComputed.default);
});