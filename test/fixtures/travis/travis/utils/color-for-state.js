define('travis/utils/color-for-state', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = colorForState;
  var colors = {
    'default': 'yellow',
    passed: 'green',
    failed: 'red',
    errored: 'red',
    canceled: 'gray'
  };

  function colorForState(state) {
    return colors[state] || colors['default'];
  }
});