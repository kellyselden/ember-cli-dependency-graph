define('ghost-admin/services/notifications', ['exports', 'ghost-admin/services/ajax'], function (exports, _ajax) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Service = Ember.Service;
    var service = Ember.inject.service;
    var dasherize = Ember.String.dasherize;
    var emberA = Ember.A;
    var isEmberArray = Ember.isArray;
    var filter = Ember.computed.filter;
    var get = Ember.get;
    var set = Ember.set;
    var isBlank = Ember.isBlank;
    exports.default = Service.extend({
        delayedNotifications: emberA(),
        content: emberA(),

        upgradeStatus: service(),

        alerts: filter('content', function (notification) {
            var status = get(notification, 'status');
            return status === 'alert';
        }),

        notifications: filter('content', function (notification) {
            var status = get(notification, 'status');
            return status === 'notification';
        }),

        handleNotification: function handleNotification(message, delayed) {
            // If this is an alert message from the server, treat it as html safe
            if (typeof message.toJSON === 'function' && message.get('status') === 'alert') {
                message.set('message', message.get('message').htmlSafe());
            }

            if (!get(message, 'status')) {
                set(message, 'status', 'notification');
            }

            // close existing duplicate alerts/notifications to avoid stacking
            if (get(message, 'key')) {
                this._removeItems(get(message, 'status'), get(message, 'key'));
            }

            if (!delayed) {
                this.get('content').pushObject(message);
            } else {
                this.get('delayedNotifications').pushObject(message);
            }
        },
        showAlert: function showAlert(message, options) {
            options = options || {};

            this.handleNotification({
                message: message,
                status: 'alert',
                type: options.type,
                key: options.key
            }, options.delayed);
        },
        showNotification: function showNotification(message, options) {
            options = options || {};

            if (!options.doNotCloseNotifications) {
                this.closeNotifications();
            } else {
                // TODO: this should be removed along with showErrors
                options.key = undefined;
            }

            this.handleNotification({
                message: message,
                status: 'notification',
                type: options.type,
                key: options.key
            }, options.delayed);
        },
        showAPIError: function showAPIError(resp, options) {
            var _this = this;

            // handle "global" errors
            if ((0, _ajax.isVersionMismatchError)(resp)) {
                return this.get('upgradeStatus').requireUpgrade();
            } else if ((0, _ajax.isMaintenanceError)(resp)) {
                return this.get('upgradeStatus').maintenanceAlert();
            }

            // loop over ember-ajax errors object
            if (resp && resp.payload && isEmberArray(resp.payload.errors)) {
                return resp.payload.errors.forEach(function (error) {
                    _this._showAPIError(error, options);
                });
            }

            this._showAPIError(resp, options);
        },
        _showAPIError: function _showAPIError(resp, options) {
            options = options || {};
            options.type = options.type || 'error';

            // if possible use the title to get a unique key
            // - we only show one alert for each key so if we get multiple errors
            //   only the last one will be shown
            if (!options.key && !isBlank(get(resp, 'title'))) {
                options.key = dasherize(get(resp, 'title'));
            }
            options.key = ['api-error', options.key].compact().join('.');

            var msg = options.defaultErrorText || 'There was a problem on the server, please try again.';

            if (resp instanceof String) {
                msg = resp;
            } else if (!isBlank(get(resp, 'detail'))) {
                msg = resp.detail;
            } else if (!isBlank(get(resp, 'message'))) {
                msg = resp.message;
            }

            this.showAlert(msg, options);
        },
        displayDelayed: function displayDelayed() {
            var _this2 = this;

            this.delayedNotifications.forEach(function (message) {
                _this2.get('content').pushObject(message);
            });
            this.delayedNotifications = [];
        },
        closeNotification: function closeNotification(notification) {
            var content = this.get('content');

            if (typeof notification.toJSON === 'function') {
                notification.deleteRecord();
                notification.save().finally(function () {
                    content.removeObject(notification);
                });
            } else {
                content.removeObject(notification);
            }
        },
        closeNotifications: function closeNotifications(key) {
            this._removeItems('notification', key);
        },
        closeAlerts: function closeAlerts(key) {
            this._removeItems('alert', key);
        },
        clearAll: function clearAll() {
            this.get('content').clear();
        },
        _removeItems: function _removeItems(status, key) {
            if (key) {
                var keyBase = this._getKeyBase(key);
                // TODO: keys should only have . special char but we should
                // probably use a better regexp escaping function/polyfill
                var escapedKeyBase = keyBase.replace('.', '\\.');
                var keyRegex = new RegExp('^' + escapedKeyBase);

                this.set('content', this.get('content').reject(function (item) {
                    var itemKey = get(item, 'key');
                    var itemStatus = get(item, 'status');

                    return itemStatus === status && itemKey && itemKey.match(keyRegex);
                }));
            } else {
                this.set('content', this.get('content').rejectBy('status', status));
            }
        },


        // take a key and return the first two elements, eg:
        // "invite.revoke.failed" => "invite.revoke"
        _getKeyBase: function _getKeyBase(key) {
            return key.split('.').slice(0, 2).join('.');
        }
    });
});