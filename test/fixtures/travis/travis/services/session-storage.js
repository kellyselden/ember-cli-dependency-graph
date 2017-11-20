define('travis/services/session-storage', ['exports', 'travis/services/storage', 'travis/utils/hash-storage'], function (exports, _storage, _hashStorage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _storage.default.extend({
    init: function init() {
      var storage = void 0;
      try {
        // firefox will not throw error on access for sessionStorage var,
        // you need to actually get something from session
        window.sessionStorage.getItem('foo');
        storage = window.sessionStorage;
      } catch (error) {
        storage = _hashStorage.default.create();
      }
      return this.set('storage', storage);
    }
  });
});