define('ghost-admin/authenticators/oauth2', ['exports', 'ember-simple-auth/authenticators/oauth2-password-grant'], function (exports, _oauth2PasswordGrant) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var RSVP = Ember.RSVP;
    var assign = Ember.assign;
    var computed = Ember.computed;
    var isEmpty = Ember.isEmpty;
    var run = Ember.run;
    var service = Ember.inject.service;
    var wrap = Ember.makeArray;
    exports.default = _oauth2PasswordGrant.default.extend({
        ajax: service(),
        session: service(),
        config: service(),
        ghostPaths: service(),

        init: function init() {
            var _this = this;

            this._super.apply(this, arguments);

            var handler = run.bind(this, function () {
                _this.onOnline();
            });
            window.addEventListener('online', handler);
        },


        serverTokenEndpoint: computed('ghostPaths.apiRoot', function () {
            return this.get('ghostPaths.apiRoot') + '/authentication/token';
        }),

        serverTokenRevocationEndpoint: computed('ghostPaths.apiRoot', function () {
            return this.get('ghostPaths.apiRoot') + '/authentication/revoke';
        }),

        makeRequest: function makeRequest(url, data) {
            /* eslint-disable camelcase */
            data.client_id = this.get('config.clientId');
            data.client_secret = this.get('config.clientSecret');
            /* eslint-enable camelcase */

            var options = {
                data: data,
                dataType: 'json',
                contentType: 'application/x-www-form-urlencoded'
            };

            return this.get('ajax').post(url, options);
        },


        /**
         * Invoked when "navigator.online" event is trigerred.
         * This is a helper function to handle intermittent internet connectivity. Token is refreshed
         * when browser status becomes "online".
         */
        onOnline: function onOnline() {
            if (this.get('session.isAuthenticated')) {
                var autoRefresh = this.get('refreshAccessTokens');
                if (autoRefresh) {
                    var expiresIn = this.get('session.data.authenticated.expires_in');
                    var token = this.get('session.data.authenticated.refresh_token');
                    return this._refreshAccessToken(expiresIn, token);
                }
            }
        },
        authenticate: function authenticate(identification, password) {
            var _this2 = this;

            var scope = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
            var headers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

            return new RSVP.Promise(function (resolve, reject) {
                var data = { 'grant_type': 'password', username: identification, password: password };
                var serverTokenEndpoint = _this2.get('serverTokenEndpoint');
                var scopesString = wrap(scope).join(' ');
                if (!isEmpty(scopesString)) {
                    data.scope = scopesString;
                }
                _this2.makeRequest(serverTokenEndpoint, data, headers).then(function (response) {
                    run(function () {
                        /* eslint-disable camelcase */
                        var expiresAt = _this2._absolutizeExpirationTime(response.expires_in);
                        _this2._scheduleAccessTokenRefresh(response.expires_in, expiresAt, response.refresh_token);
                        /* eslint-enable camelcase */

                        if (!isEmpty(expiresAt)) {
                            response = assign(response, { 'expires_at': expiresAt });
                        }

                        resolve(response);
                    });
                }, function (error) {
                    reject(error);
                });
            });
        }
    });
});