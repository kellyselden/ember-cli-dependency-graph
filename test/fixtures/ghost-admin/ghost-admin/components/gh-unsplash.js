define('ghost-admin/components/gh-unsplash', ['exports', 'ghost-admin/mixins/shortcuts'], function (exports, _shortcuts) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var bind = Ember.run.bind;
    var or = Ember.computed.or;
    var service = Ember.inject.service;


    var ONE_COLUMN_WIDTH = 540;
    var TWO_COLUMN_WIDTH = 940;

    exports.default = Component.extend(_shortcuts.default, {
        resizeDetector: service(),
        unsplash: service(),
        ui: service(),

        tagName: '',
        zoomedPhoto: null,

        shortcuts: {
            escape: 'handleEscape'
        },

        // closure actions
        close: function close() {},
        insert: function insert() {},


        sideNavHidden: or('ui.{autoNav,isFullScreen,showMobileMenu}'),

        didInsertElement: function didInsertElement() {
            this._super.apply(this, arguments);
            this._resizeCallback = bind(this, this._handleResize);
            this.get('resizeDetector').setup('.gh-unsplash', this._resizeCallback);
            this.registerShortcuts();
        },
        willDestroyElement: function willDestroyElement() {
            this._super.apply(this, arguments);
            this.get('resizeDetector').teardown('.gh-unsplash', this._resizeCallback);
            this.removeShortcuts();
        },


        actions: {
            loadNextPage: function loadNextPage() {
                this.get('unsplash').loadNextPage();
            },
            zoomPhoto: function zoomPhoto(photo) {
                this.set('zoomedPhoto', photo);
            },
            closeZoom: function closeZoom() {
                this.set('zoomedPhoto', null);
            },
            insert: function insert(photo) {
                this.insert(photo);
                this.close();
            },
            close: function close() {
                this.close();
            },
            retry: function retry() {
                this.get('unsplash').retryLastRequest();
            },
            handleEscape: function handleEscape() {
                if (!this.get('zoomedPhoto')) {
                    this.close();
                }
            }
        },

        _handleResize: function _handleResize(element) {
            var width = element.clientWidth;
            var columns = 3;

            if (width <= ONE_COLUMN_WIDTH) {
                columns = 1;
            } else if (width <= TWO_COLUMN_WIDTH) {
                columns = 2;
            }

            this.get('unsplash').changeColumnCount(columns);
        }
    });
});