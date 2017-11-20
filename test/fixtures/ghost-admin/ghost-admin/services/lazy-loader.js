define('ghost-admin/services/lazy-loader', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var $ = Ember.$;
    var RSVP = Ember.RSVP;
    var Service = Ember.Service;
    var service = Ember.inject.service;
    var testing = Ember.testing;
    exports.default = Service.extend({
        ajax: service(),
        ghostPaths: service(),

        // This is needed so we can disable it in unit tests
        testing: testing,

        scriptPromises: {},

        loadScript: function loadScript(key, url) {
            if (this.get('testing')) {
                return RSVP.resolve();
            }

            if (this.get('scriptPromises.' + key)) {
                // Script is already loaded/in the process of being loaded,
                // so return that promise
                return this.get('scriptPromises.' + key);
            }

            var ajax = this.get('ajax');
            var adminRoot = this.get('ghostPaths.adminRoot');

            var scriptPromise = ajax.request('' + adminRoot + url, {
                dataType: 'script',
                cache: true
            });

            this.set('scriptPromises.' + key, scriptPromise);

            return scriptPromise;
        },
        loadStyle: function loadStyle(key, url) {
            var _this = this;

            var alternate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            if (this.get('testing') || $('#' + key + '-styles').length) {
                return RSVP.resolve();
            }

            return new RSVP.Promise(function (resolve, reject) {
                var link = document.createElement('link');
                link.id = key + '-styles';
                link.rel = alternate ? 'alternate stylesheet' : 'stylesheet';
                link.href = '' + _this.get('ghostPaths.adminRoot') + url;
                link.onload = function () {
                    if (alternate) {
                        // If stylesheet is alternate and we disable the stylesheet before injecting into the DOM,
                        // the onload handler never gets called. Thus, we should disable the link after it has finished loading
                        link.disabled = true;
                    }
                    resolve();
                };
                link.onerror = reject;

                if (alternate) {
                    link.title = key;
                }

                $('head').append($(link));
            });
        }
    });
});