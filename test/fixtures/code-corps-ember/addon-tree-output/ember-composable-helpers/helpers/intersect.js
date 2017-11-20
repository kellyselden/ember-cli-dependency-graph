define('ember-composable-helpers/helpers/intersect', ['exports', 'ember-composable-helpers/-private/create-multi-array-helper'], function (exports, _createMultiArrayHelper) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var intersect = Ember.computed.intersect;
  exports.default = (0, _createMultiArrayHelper.default)(intersect);
});