define('travis/components/status-image-input', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var TextArea = Ember.TextArea;
  exports.default = TextArea.extend({
    click: function click() {
      this.get('element').select();
    }
  });
});