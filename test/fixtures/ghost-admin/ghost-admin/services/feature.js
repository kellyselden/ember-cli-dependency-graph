define('ghost-admin/services/feature', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.feature = feature;
    var EmberError = Ember.Error;
    var RSVP = Ember.RSVP;
    var Service = Ember.Service;
    var service = Ember.inject.service;
    var computed = Ember.computed;
    var set = Ember.set;
    function feature(name) {
        var user = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var watchedProps = user ? ['accessibility.' + name] : ['config.' + name, 'labs.' + name];

        return computed.apply(Ember, watchedProps.concat({
            get: function get() {
                if (user) {
                    return this.get('accessibility.' + name);
                }

                if (this.get('config.' + name)) {
                    return this.get('config.' + name);
                }

                return this.get('labs.' + name) || false;
            },
            set: function set(key, value) {
                this.update(key, value, user);
                return value;
            }
        }));
    }

    exports.default = Service.extend({
        store: service(),
        config: service(),
        session: service(),
        settings: service(),
        notifications: service(),

        publicAPI: feature('publicAPI'),
        subscribers: feature('subscribers'),
        nightShift: feature('nightShift', true),

        _user: null,

        labs: computed('settings.labs', function () {
            var labs = this.get('settings.labs');

            try {
                return JSON.parse(labs) || {};
            } catch (e) {
                return {};
            }
        }),

        accessibility: computed('_user.accessibility', function () {
            var accessibility = this.get('_user.accessibility');

            try {
                return JSON.parse(accessibility) || {};
            } catch (e) {
                return {};
            }
        }),

        fetch: function fetch() {
            var _this = this;

            return RSVP.hash({
                settings: this.get('settings').fetch(),
                user: this.get('session.user')
            }).then(function (_ref) {
                var user = _ref.user;

                _this.set('_user', user);

                return true;
            });
        },
        update: function update(key, value) {
            var _this2 = this;

            var user = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            var serviceProperty = user ? 'accessibility' : 'labs';
            var model = this.get(user ? '_user' : 'settings');
            var featureObject = this.get(serviceProperty);

            // set the new key value for either the labs property or the accessibility property
            set(featureObject, key, value);

            // update the 'labs' or 'accessibility' key of the model
            model.set(serviceProperty, JSON.stringify(featureObject));

            return model.save().then(function () {
                // return the labs key value that we get from the server
                _this2.notifyPropertyChange(serviceProperty);
                return _this2.get(serviceProperty + '.' + key);
            }).catch(function (error) {
                model.rollbackAttributes();
                _this2.notifyPropertyChange(serviceProperty);

                // we'll always have an errors object unless we hit a
                // validation error
                if (!error) {
                    throw new EmberError('Validation of the feature service ' + (user ? 'user' : 'settings') + ' model failed when updating ' + serviceProperty + '.');
                }

                _this2.get('notifications').showAPIError(error);

                return _this2.get(serviceProperty + '.' + key);
            });
        }
    });
});