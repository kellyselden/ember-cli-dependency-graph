define('ghost-admin/adapters/base', ['exports', 'ember-ajax/mixins/ajax-support', 'ember-simple-auth/mixins/data-adapter-mixin', 'ember-data/adapters/rest', 'ghost-admin/utils/ghost-paths'], function (exports, _ajaxSupport, _dataAdapterMixin, _rest, _ghostPaths) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var service = Ember.inject.service;
    exports.default = _rest.default.extend(_dataAdapterMixin.default, _ajaxSupport.default, {
        authorizer: 'authorizer:oauth2',

        host: window.location.origin,
        namespace: (0, _ghostPaths.default)().apiRoot.slice(1),

        session: service(),

        shouldBackgroundReloadRecord: function shouldBackgroundReloadRecord() {
            return false;
        },
        query: function query(store, type, _query) {
            var id = void 0;

            if (_query.id) {
                id = _query.id;
                delete _query.id;
            }

            return this.ajax(this.buildURL(type.modelName, id), 'GET', { data: _query });
        },
        buildURL: function buildURL() {
            // Ensure trailing slashes
            var url = this._super.apply(this, arguments);

            if (url.slice(-1) !== '/') {
                url += '/';
            }

            return url;
        }
    });
});