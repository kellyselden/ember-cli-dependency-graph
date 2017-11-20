define('ghost-admin/components/gh-navitem-url-input', ['exports', 'ember-invoke-action'], function (exports, _emberInvokeAction) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var TextField = Ember.TextField;
    var computed = Ember.computed;
    var run = Ember.run;


    var joinUrlParts = function joinUrlParts(url, path) {
        if (path[0] !== '/' && url.slice(-1) !== '/') {
            path = '/' + path;
        } else if (path[0] === '/' && url.slice(-1) === '/') {
            path = path.slice(1);
        }

        return url + path;
    };

    var isRelative = function isRelative(url) {
        // "protocol://", "//example.com", "scheme:", "#anchor", & invalid paths
        // should all be treated as absolute
        return !url.match(/\s/) && !validator.isURL(url) && !url.match(/^(\/\/|#|[a-zA-Z0-9-]+:)/);
    };

    exports.default = TextField.extend(_emberInvokeAction.InvokeActionMixin, {
        classNames: 'gh-input',

        isBaseUrl: computed('baseUrl', 'value', function () {
            return this.get('baseUrl') === this.get('value');
        }),

        didReceiveAttrs: function didReceiveAttrs() {
            this._super.apply(this, arguments);

            var baseUrl = this.get('baseUrl');
            var url = this.get('url');

            // if we have a relative url, create the absolute url to be displayed in the input
            if (isRelative(url)) {
                url = joinUrlParts(baseUrl, url);
            }

            this.set('value', url);
        },
        focusIn: function focusIn(event) {
            this.set('hasFocus', true);

            if (this.get('isBaseUrl')) {
                // position the cursor at the end of the input
                run.next(function (el) {
                    var length = el.value.length;


                    el.setSelectionRange(length, length);
                }, event.target);
            }
        },
        keyDown: function keyDown(event) {
            // delete the "placeholder" value all at once
            if (this.get('isBaseUrl') && (event.keyCode === 8 || event.keyCode === 46)) {
                this.set('value', '');

                event.preventDefault();
            }

            // CMD-S
            if (event.keyCode === 83 && event.metaKey) {
                this.notifyUrlChanged();
            }
        },
        keyPress: function keyPress(event) {
            this.invokeAction('clearErrors');

            // enter key
            if (event.keyCode === 13) {
                this.notifyUrlChanged();
            }

            return true;
        },
        focusOut: function focusOut() {
            this.set('hasFocus', false);

            this.notifyUrlChanged();
        },
        notifyUrlChanged: function notifyUrlChanged() {
            var url = this.get('value').trim();
            var urlParts = document.createElement('a');
            var baseUrl = this.get('baseUrl');
            var baseUrlParts = document.createElement('a');

            // ensure value property is trimmed
            this.set('value', url);

            // leverage the browser's native URI parsing
            urlParts.href = url;
            baseUrlParts.href = baseUrl;

            // if we have an email address, add the mailto:
            if (validator.isEmail(url)) {
                url = 'mailto:' + url;
                this.set('value', url);
            }

            // if we have a relative url, create the absolute url to be displayed in the input
            if (isRelative(url)) {
                url = joinUrlParts(baseUrl, url);
                this.set('value', url);
            }

            // get our baseUrl relativity checks in order
            var isOnSameHost = urlParts.host === baseUrlParts.host;
            var isAnchorLink = url.match(/^#/);
            var isRelativeToBasePath = urlParts.pathname.indexOf(baseUrlParts.pathname) === 0;

            // if our pathname is only missing a trailing / mark it as relative
            if (urlParts.pathname + '/' === baseUrlParts.pathname) {
                isRelativeToBasePath = true;
            }

            // if relative to baseUrl, remove the base url before sending to action
            if (!isAnchorLink && isOnSameHost && isRelativeToBasePath) {
                url = url.replace(/^[a-zA-Z0-9-]+:/, '');
                url = url.replace(/^\/\//, '');
                url = url.replace(baseUrlParts.host, '');
                url = url.replace(baseUrlParts.pathname, '');

                // handle case where url path is same as baseUrl path but missing trailing slash
                if (urlParts.pathname.slice(-1) !== '/') {
                    url = url.replace(baseUrlParts.pathname.slice(0, -1), '');
                }

                if (url !== '' || !this.get('isNew')) {
                    if (!url.match(/^\//)) {
                        url = '/' + url;
                    }

                    if (!url.match(/\/$/) && !url.match(/[.#?]/)) {
                        url = url + '/';
                    }
                }
            }

            this.sendAction('change', url);
        }
    });
});