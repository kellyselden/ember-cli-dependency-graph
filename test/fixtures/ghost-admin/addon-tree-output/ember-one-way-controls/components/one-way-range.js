define('ember-one-way-controls/components/one-way-range', ['exports', 'ember-one-way-controls/components/one-way-input'], function (exports, _oneWayInput) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _oneWayInput.default.extend({
    type: 'range'
  });
});