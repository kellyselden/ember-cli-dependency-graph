define('ember-simple-auth/session-stores/session-storage', ['exports', 'ember-simple-auth/session-stores/base', 'ember-simple-auth/utils/objects-are-equal'], function (exports, _base, _objectsAreEqual) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var RSVP = Ember.RSVP,
      computed = Ember.computed,
      getOwner = Ember.getOwner,
      bind = Ember.run.bind;
  exports.default = _base.default.extend({
    _isFastBoot: computed(function () {
      var fastboot = getOwner(this).lookup('service:fastboot');

      return fastboot ? fastboot.get('isFastBoot') : false;
    }),

    /**
      The `sessionStorage` key the store persists data in.
       @property key
      @type String
      @default 'ember_simple_auth-session'
      @public
    */
    key: 'ember_simple_auth-session',

    init: function init() {
      this._super.apply(this, arguments);

      if (!this.get('_isFastBoot')) {
        window.addEventListener('storage', bind(this, this._handleStorageEvent));
      }
    },
    willDestroy: function willDestroy() {
      if (!this.get('_isFastBoot')) {
        window.removeEventListener('storage', bind(this, this._handleStorageEvent));
      }
    },


    /**
      Persists the `data` in the `sessionStorage`.
       @method persist
      @param {Object} data The data to persist
      @return {Ember.RSVP.Promise} A promise that resolves when the data has successfully been persisted and rejects otherwise.
      @public
    */
    persist: function persist(data) {
      this._lastData = data;
      data = JSON.stringify(data || {});
      sessionStorage.setItem(this.key, data);

      return RSVP.resolve();
    },


    /**
      Returns all data currently stored in the `sessionStorage` as a plain object.
       @method restore
      @return {Ember.RSVP.Promise} A promise that resolves with the data currently persisted in the store when the data has been restored successfully and rejects otherwise.
      @public
    */
    restore: function restore() {
      var data = sessionStorage.getItem(this.key);

      return RSVP.resolve(JSON.parse(data) || {});
    },


    /**
      Clears the store by deleting the
      {{#crossLink "sessionStorageStore/key:property"}}{{/crossLink}} from
      `sessionStorage`.
       @method clear
      @return {Ember.RSVP.Promise} A promise that resolves when the store has been cleared successfully and rejects otherwise.
      @public
    */
    clear: function clear() {
      sessionStorage.removeItem(this.key);
      this._lastData = {};

      return RSVP.resolve();
    },
    _handleStorageEvent: function _handleStorageEvent(e) {
      var _this = this;

      if (e.key === this.get('key')) {
        this.restore().then(function (data) {
          if (!(0, _objectsAreEqual.default)(data, _this._lastData)) {
            _this._lastData = data;
            _this.trigger('sessionDataUpdated', data);
          }
        });
      }
    }
  });
});