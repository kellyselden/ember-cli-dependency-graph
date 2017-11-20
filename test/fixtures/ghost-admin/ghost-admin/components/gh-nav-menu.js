define('ghost-admin/components/gh-nav-menu', ['exports', 'ember-basic-dropdown/utils/calculate-position'], function (exports, _calculatePosition2) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var computed = Ember.computed;
    var htmlSafe = Ember.String.htmlSafe;
    var service = Ember.inject.service;
    exports.default = Component.extend({
        config: service(),
        feature: service(),
        ghostPaths: service(),
        router: service('router'),
        session: service(),
        ui: service(),

        tagName: 'nav',
        classNames: ['gh-nav'],
        classNameBindings: ['open'],

        open: false,
        iconStyle: '',

        // the menu has a rendering issue (#8307) when the the world is reloaded
        // during an import which we have worked around by not binding the icon
        // style directly. However we still need to keep track of changing icons
        // so that we can refresh when a new icon is uploaded
        didReceiveAttrs: function didReceiveAttrs() {
            this._setIconStyle();
        },
        mouseEnter: function mouseEnter() {
            this.sendAction('onMouseEnter');
        },


        showMenuExtension: computed('config.clientExtensions.menu', 'session.user.isOwner', function () {
            return this.get('config.clientExtensions.menu') && this.get('session.user.isOwner');
        }),

        showDropdownExtension: computed('config.clientExtensions.dropdown', 'session.user.isOwner', function () {
            return this.get('config.clientExtensions.dropdown') && this.get('session.user.isOwner');
        }),

        showScriptExtension: computed('config.clientExtensions.script', 'session.user.isOwner', function () {
            return this.get('config.clientExtensions.script') && this.get('session.user.isOwner');
        }),

        // equivalent to "left: auto; right: -20px"
        userDropdownPosition: function userDropdownPosition(trigger, dropdown) {
            var _calculatePosition = _calculatePosition2.default.apply(undefined, arguments),
                horizontalPosition = _calculatePosition.horizontalPosition,
                verticalPosition = _calculatePosition.verticalPosition,
                style = _calculatePosition.style;

            var _dropdown$firstElemen = dropdown.firstElementChild.getBoundingClientRect(),
                dropdownWidth = _dropdown$firstElemen.width;

            style.right += dropdownWidth - 20;
            style['z-index'] = 1100;

            return { horizontalPosition: horizontalPosition, verticalPosition: verticalPosition, style: style };
        },
        _setIconStyle: function _setIconStyle() {
            var icon = this.get('icon');

            if (icon === this._icon) {
                return;
            }

            this._icon = icon;

            if (icon && icon.match(/^https?:\/\//i)) {
                this.set('iconStyle', htmlSafe('background-image: url(' + icon + ')'));
                return;
            }

            var subdirRegExp = new RegExp('^' + this.get('ghostPaths.subdir'));
            var blogIcon = icon ? icon : 'favicon.ico';
            var iconUrl = void 0;

            blogIcon = blogIcon.replace(subdirRegExp, '');

            iconUrl = this.get('ghostPaths.url').join(this.get('config.blogUrl'), blogIcon).replace(/\/$/, '');
            iconUrl += '?t=' + new Date().valueOf();

            this.set('iconStyle', htmlSafe('background-image: url(' + iconUrl + ')'));
        },


        actions: {
            showMarkdownHelp: function showMarkdownHelp() {
                this.sendAction('showMarkdownHelp');
            }
        }
    });
});