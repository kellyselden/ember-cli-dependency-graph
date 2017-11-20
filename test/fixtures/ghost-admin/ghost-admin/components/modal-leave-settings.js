define('ghost-admin/components/modal-leave-settings', ['exports', 'ghost-admin/components/modal-base', 'ember-invoke-action'], function (exports, _modalBase, _emberInvokeAction) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _modalBase.default.extend({
        actions: {
            confirm: function confirm() {
                var _this = this;

                (0, _emberInvokeAction.invokeAction)(this, 'confirm').finally(function () {
                    _this.send('closeModal');
                });
            }
        }
    });
});