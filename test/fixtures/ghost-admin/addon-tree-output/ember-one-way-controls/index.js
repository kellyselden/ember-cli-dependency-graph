define('ember-one-way-controls/index', ['exports', 'ember-one-way-controls/components/one-way-select', 'ember-one-way-controls/components/one-way-input'], function (exports, _oneWaySelect, _oneWayInput) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'OneWaySelect', {
    enumerable: true,
    get: function () {
      return _oneWaySelect.OneWaySelect;
    }
  });
  Object.defineProperty(exports, 'OneWayInput', {
    enumerable: true,
    get: function () {
      return _oneWayInput.default;
    }
  });
});