define('ghost-admin/adapters/theme', ['exports', 'ghost-admin/adapters/application'], function (exports, _application) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _application.default.extend({
        activate: function activate(model) {
            var _this = this;

            var url = this.buildURL('theme', model.get('id')) + 'activate/';

            return this.ajax(url, 'PUT', { data: {} }).then(function (data) {
                _this.store.pushPayload(data);
                return model;
            });
        }
    });
});