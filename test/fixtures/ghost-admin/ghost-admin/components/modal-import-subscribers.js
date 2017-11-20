define('ghost-admin/components/modal-import-subscribers', ['exports', 'ghost-admin/components/modal-base', 'ghost-admin/utils/ghost-paths', 'ember-invoke-action'], function (exports, _modalBase, _ghostPaths, _emberInvokeAction) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var computed = Ember.computed;
    exports.default = _modalBase.default.extend({
        labelText: 'Select or drag-and-drop a CSV File',

        response: null,
        closeDisabled: false,

        uploadUrl: computed(function () {
            return (0, _ghostPaths.default)().apiRoot + '/subscribers/csv/';
        }),

        actions: {
            uploadStarted: function uploadStarted() {
                this.set('closeDisabled', true);
            },
            uploadFinished: function uploadFinished() {
                this.set('closeDisabled', false);
            },
            uploadSuccess: function uploadSuccess(response) {
                this.set('response', response.meta.stats);
                // invoke the passed in confirm action
                (0, _emberInvokeAction.invokeAction)(this, 'confirm');
            },
            confirm: function confirm() {
                // noop - we don't want the enter key doing anything
            },
            closeModal: function closeModal() {
                if (!this.get('closeDisabled')) {
                    this._super.apply(this, arguments);
                }
            }
        }
    });
});