define('ghost-admin/components/gh-image-uploader-with-preview', ['exports', 'ember-invoke-action'], function (exports, _emberInvokeAction) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    exports.default = Component.extend({

        allowUnsplash: false,

        actions: {
            update: function update() {
                if (typeof this.attrs.update === 'function') {
                    var _attrs;

                    (_attrs = this.attrs).update.apply(_attrs, arguments);
                }
            },
            uploadStarted: function uploadStarted() {
                if (typeof this.attrs.uploadStarted === 'function') {
                    var _attrs2;

                    (_attrs2 = this.attrs).uploadStarted.apply(_attrs2, arguments);
                }
            },
            uploadFinished: function uploadFinished() {
                if (typeof this.attrs.uploadFinished === 'function') {
                    var _attrs3;

                    (_attrs3 = this.attrs).uploadFinished.apply(_attrs3, arguments);
                }
            },
            remove: function remove() {
                (0, _emberInvokeAction.invokeAction)(this, 'remove');
            }
        }
    });
});