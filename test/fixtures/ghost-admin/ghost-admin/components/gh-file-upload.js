define('ghost-admin/components/gh-file-upload', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    exports.default = Component.extend({
        _file: null,

        acceptEncoding: null,
        uploadButtonText: 'Text',
        uploadButtonDisabled: true,

        // closure actions
        onUpload: function onUpload() {},
        onAdd: function onAdd() {},


        shouldResetForm: true,

        change: function change(event) {
            this.set('uploadButtonDisabled', false);
            this.onAdd();
            this._file = event.target.files[0];
        },


        actions: {
            upload: function upload() {
                if (!this.get('uploadButtonDisabled') && this._file) {
                    this.onUpload(this._file);
                }

                // Prevent double post by disabling the button.
                this.set('uploadButtonDisabled', true);

                // Reset form
                if (this.get('shouldResetForm')) {
                    this.$().closest('form')[0].reset();
                }
            }
        }
    });
});