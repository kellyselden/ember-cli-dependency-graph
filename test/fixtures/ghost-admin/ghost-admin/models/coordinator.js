define('ghost-admin/models/coordinator', ['exports', 'ghost-admin/models/obj-hash'], function (exports, _objHash) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Object.extend(Ember.Evented, {
    objectMap: Ember.computed(function () {
      return _objHash.default.create();
    }),

    getObject: function getObject(id, ops) {
      ops = ops || {};
      var payload = this.get('objectMap').getObj(id);

      if (payload.ops.source) {
        payload.ops.source.sendAction('action', payload.obj);
      }

      if (payload.ops.target) {
        payload.ops.target.sendAction('action', payload.obj);
      }

      this.trigger("objectMoved", { obj: payload.obj, source: payload.ops.source, target: ops.target });

      return payload.obj;
    },

    setObject: function setObject(obj, ops) {
      ops = ops || {};
      return this.get('objectMap').add({ obj: obj, ops: ops });
    }
  });
});