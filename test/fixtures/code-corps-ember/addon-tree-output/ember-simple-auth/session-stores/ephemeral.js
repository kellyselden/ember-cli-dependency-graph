define('ember-simple-auth/session-stores/ephemeral', ['exports', 'ember-simple-auth/session-stores/base'], function (exports, _base) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var RSVP = Ember.RSVP;
  exports.default = _base.default.extend({
    init: function init() {
      this._super.apply(this, arguments);
      this.clear();
    },


    /**
      Persists `data`. This replaces all currently stored data.
       @method persist
      @param {Object} data The data to persist
      @return {Ember.RSVP.Promise} A promise that resolves when the data has successfully been persisted and rejects otherwise.
      @public
    */
    persist: function persist(data) {
      this._data = JSON.stringify(data || {});

      return RSVP.resolve();
    },


    /**
      Returns all data currently stored as a plain object.
       @method restore
      @return {Ember.RSVP.Promise} A promise that resolves with the data currently persisted in the store when the data has been restored successfully and rejects otherwise.
      @public
    */
    restore: function restore() {
      var data = JSON.parse(this._data) || {};

      return RSVP.resolve(data);
    },


    /**
      Clears the store.
       @method clear
      @return {Ember.RSVP.Promise} A promise that resolves when the store has been cleared successfully and rejects otherwise.
      @public
    */
    clear: function clear() {
      delete this._data;
      this._data = '{}';

      return RSVP.resolve();
    }
  });
});