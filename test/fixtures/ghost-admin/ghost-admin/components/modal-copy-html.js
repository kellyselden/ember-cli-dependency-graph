define('ghost-admin/components/modal-copy-html', ['exports', 'ghost-admin/components/modal-base'], function (exports, _modalBase) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var alias = Ember.computed.alias;
    exports.default = _modalBase.default.extend({
        generatedHtml: alias('model')
    });
});