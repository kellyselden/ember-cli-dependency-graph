define('liquid-wormhole/components/liquid-append', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    didUpdateAttrs: function didUpdateAttrs() {
      if (this.get('replaceNodes')) {
        var nodes = this.get('nodes');

        this.$().children().remove();
        this.$().append(nodes);
      }
    },
    didInsertElement: function didInsertElement() {
      var notify = this.get('notify');
      var nodes = this.get('nodes');

      if (notify && notify.willAppendNodes) {
        notify.willAppendNodes(this.element);
      }

      this.$().append(nodes);

      if (notify && notify.didAppendNodes) {
        notify.didAppendNodes(this.element);
      }
    }
  });
});