define('ghost-admin/components/gh-file-input', ['exports', 'emberx-file-input/components/x-file-input'], function (exports, _xFileInput) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var testing = Ember.testing;
    exports.default = _xFileInput.default.extend({
        change: function change(e) {
            var files = testing ? (e.originalEvent || e).testingFiles : e.target.files;
            this.sendAction('action', files);
        }
    });
});