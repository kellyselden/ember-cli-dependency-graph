define('ghost-admin/services/ui', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Service = Ember.Service;
    var service = Ember.inject.service;
    var computed = Ember.computed;
    var not = Ember.computed.not;
    var or = Ember.computed.or;
    var reads = Ember.computed.reads;
    exports.default = Service.extend({
        dropdown: service(),
        mediaQueries: service(),

        autoNav: false,
        isFullScreen: false,
        showMobileMenu: false,
        showSettingsMenu: false,

        hasSideNav: not('isSideNavHidden'),
        isMobile: reads('mediaQueries.isMobile'),
        isSideNavHidden: or('autoNav', 'isFullScreen', 'isMobile'),

        autoNavOpen: computed('autoNav', {
            get: function get() {
                return false;
            },
            set: function set(key, value) {
                if (this.get('autoNav')) {
                    return value;
                }
                return false;
            }
        }),

        closeMenus: function closeMenus() {
            this.get('dropdown').closeDropdowns();
            this.setProperties({
                showSettingsMenu: false,
                showMobileMenu: false
            });
        },
        openAutoNav: function openAutoNav() {
            this.set('autoNavOpen', true);
        },
        closeAutoNav: function closeAutoNav() {
            if (this.get('autoNavOpen')) {
                this.get('dropdown').closeDropdowns();
            }
            this.set('autoNavOpen', false);
        },
        closeMobileMenu: function closeMobileMenu() {
            this.set('showMobileMenu', false);
        },
        openMobileMenu: function openMobileMenu() {
            this.set('showMobileMenu', true);
        },
        openSettingsMenu: function openSettingsMenu() {
            this.set('showSettingsMenu', true);
        },
        toggleAutoNav: function toggleAutoNav() {
            this.toggleProperty('autoNav');
        },


        actions: {
            closeMenus: function closeMenus() {
                this.closeMenus();
            },
            openAutoNav: function openAutoNav() {
                this.openAutoNav();
            },
            closeAutoNav: function closeAutoNav() {
                this.closeAutoNav();
            },
            closeMobileMenu: function closeMobileMenu() {
                this.closeMobileMenu();
            },
            openMobileMenu: function openMobileMenu() {
                this.openMobileMenu();
            },
            openSettingsMenu: function openSettingsMenu() {
                this.openSettingsMenu();
            },
            toggleAutoNav: function toggleAutoNav() {
                this.toggleAutoNav();
            }
        }
    });
});