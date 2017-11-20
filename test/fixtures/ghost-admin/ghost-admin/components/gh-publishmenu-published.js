define('ghost-admin/components/gh-publishmenu-published', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    exports.default = Component.extend({

        'data-test-publishmenu-published': true,

        didInsertElement: function didInsertElement() {
            this.get('setSaveType')('publish');
        }
    });
});