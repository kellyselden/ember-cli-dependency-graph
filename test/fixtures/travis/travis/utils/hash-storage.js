define('travis/utils/hash-storage', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var EmberObject = Ember.Object;
  exports.default = EmberObject.extend({
    init: function init() {
      return this.set('storage', {});
    },
    key: function key(_key) {
      var k = _key.replace('.', '__');
      return '__' + k;
    },
    getItem: function getItem(k) {
      return this.get('storage.' + this.key(k));
    },
    setItem: function setItem(k, v) {
      return this.set('storage.' + this.key(k), v);
    },
    removeItem: function removeItem(k) {
      return this.setItem(k, null);
    },
    clear: function clear() {
      return this.set('storage', {});
    }
  });
});