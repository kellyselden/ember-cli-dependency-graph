define('ember-concurrency/-evented-observable', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var EmberObject = Ember.Object;
  exports.default = EmberObject.extend({
    obj: null,
    eventName: null,

    subscribe: function subscribe(onNext) {
      var obj = this.obj;
      var eventName = this.eventName;
      obj.on(eventName, onNext);

      var isDisposed = false;
      return {
        dispose: function dispose() {
          if (isDisposed) {
            return;
          }
          isDisposed = true;
          obj.off(eventName, onNext);
        }
      };
    }
  });
});