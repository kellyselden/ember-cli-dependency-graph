define('ghost-admin/components/modal-theme-warnings', ['exports', 'ghost-admin/components/modal-base'], function (exports, _modalBase) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var reads = Ember.computed.reads;
    exports.default = _modalBase.default.extend({
        title: reads('model.title'),
        message: reads('model.message'),
        warnings: reads('model.warnings'),
        errors: reads('model.errors'),
        fatalErrors: reads('model.fatalErrors'),
        canActivate: reads('model.canActivate'),

        'data-test-theme-warnings-modal': true
    });
});