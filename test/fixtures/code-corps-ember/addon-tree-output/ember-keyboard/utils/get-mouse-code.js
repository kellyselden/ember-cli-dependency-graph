define('ember-keyboard/utils/get-mouse-code', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = getMouseName;
  var isNone = Ember.isNone;
  function getMouseName(buttonCode) {
    if (isNone(buttonCode)) return;

    switch (buttonCode) {
      case 'left':
        return 0;
      case 'middle':
        return 1;
      case 'right':
        return 2;
    }
  }
});