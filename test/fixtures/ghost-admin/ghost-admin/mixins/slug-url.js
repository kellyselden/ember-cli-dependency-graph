define('ghost-admin/mixins/slug-url', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Mixin = Ember.Mixin;
    var isBlank = Ember.isBlank;
    exports.default = Mixin.create({
        buildURL: function buildURL(_modelName, _id, _snapshot, _requestType, query) {
            var url = this._super.apply(this, arguments);

            if (query && !isBlank(query.slug)) {
                url += 'slug/' + query.slug + '/';
                delete query.slug;
            }

            return url;
        }
    });
});