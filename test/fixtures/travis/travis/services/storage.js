define('travis/services/storage', ['exports', 'travis/utils/hash-storage'], function (exports, _hashStorage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Service = Ember.Service;
  exports.default = Service.extend({
    init: function init() {
      var storage = void 0;
      try {
        storage = window.localStorage || function () {
          throw 'no storage';
        }();
      } catch (error) {
        storage = _hashStorage.default.create();
      }
      return this.set('storage', storage);
    },
    getItem: function getItem(key) {
      return this.get('storage').getItem(key);
    },
    setItem: function setItem(key, value) {
      return this.get('storage').setItem(key, value);
    },
    removeItem: function removeItem(key) {
      return this.get('storage').removeItem(key);
    },
    clear: function clear() {
      return this.get('storage').clear();
    }
  });
});