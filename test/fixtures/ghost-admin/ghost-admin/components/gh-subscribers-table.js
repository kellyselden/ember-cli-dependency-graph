define('ghost-admin/components/gh-subscribers-table', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    exports.default = Component.extend({
        classNames: ['subscribers-table'],

        table: null,

        actions: {
            onScrolledToBottom: function onScrolledToBottom() {
                var loadNextPage = this.get('loadNextPage');

                if (!this.get('isLoading')) {
                    loadNextPage();
                }
            }
        }
    });
});