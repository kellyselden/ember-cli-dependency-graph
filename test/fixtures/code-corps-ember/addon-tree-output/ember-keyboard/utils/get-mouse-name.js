define('ember-keyboard/utils/get-mouse-name', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = getMouseName;
  var isNone = Ember.isNone;
  function getMouseName(buttonCode) {
    if (isNone(buttonCode)) return;

    switch (buttonCode) {
      case 0:
        return 'left';
      case 1:
        return 'middle';
      case 2:
        return 'right';
    }
  }
});