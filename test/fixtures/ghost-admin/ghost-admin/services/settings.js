define('ghost-admin/services/settings', ['exports', 'ghost-admin/mixins/validation-engine'], function (exports, _validationEngine) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var RSVP = Ember.RSVP;
    var Service = Ember.Service;
    var service = Ember.inject.service;
    var get = Ember.get;
    var _ProxyMixin = Ember._ProxyMixin;
    exports.default = Service.extend(_ProxyMixin, _validationEngine.default, {
        store: service(),

        // will be set to the single Settings model, it's a reference so any later
        // changes to the settings object in the store will be reflected
        content: null,

        validationType: 'setting',
        _loadingPromise: null,

        // this is an odd case where we only want to react to changes that we get
        // back from the API rather than local updates
        settledIcon: '',

        // the settings API endpoint is a little weird as it's singular and we have
        // to pass in all types - if we ever fetch settings without all types then
        // save we have problems with the missing settings being removed or reset
        _loadSettings: function _loadSettings() {
            var _this = this;

            if (!this._loadingPromise) {
                this._loadingPromise = this.get('store').queryRecord('setting', { type: 'blog,theme,private' }).then(function (settings) {
                    _this._loadingPromise = null;
                    return settings;
                });
            }

            return this._loadingPromise;
        },
        fetch: function fetch() {
            if (!this.get('content')) {
                return this.reload();
            } else {
                return RSVP.resolve(this);
            }
        },
        reload: function reload() {
            var _this2 = this;

            return this._loadSettings().then(function (settings) {
                _this2.set('content', settings);
                _this2.set('settledIcon', get(settings, 'icon'));
                return _this2;
            });
        },
        save: function save() {
            var _this3 = this;

            var settings = this.get('content');

            if (!settings) {
                return false;
            }

            return settings.save().then(function (settings) {
                _this3.set('settledIcon', get(settings, 'icon'));
                return settings;
            });
        },
        rollbackAttributes: function rollbackAttributes() {
            return this.get('content').rollbackAttributes();
        }
    });
});