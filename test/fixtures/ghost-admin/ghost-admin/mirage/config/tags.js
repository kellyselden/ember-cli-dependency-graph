define('ghost-admin/mirage/config/tags', ['exports', 'ghost-admin/mirage/utils'], function (exports, _utils) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = mockTags;
    var dasherize = Ember.String.dasherize;
    var isBlank = Ember.isBlank;
    function mockTags(server) {
        server.post('/tags/', function (_ref) {
            var tags = _ref.tags;

            var attrs = this.normalizedRequestAttrs();

            if (isBlank(attrs.slug) && !isBlank(attrs.name)) {
                attrs.slug = dasherize(attrs.name);
            }

            // NOTE: this does not use the tag factory to fill in blank fields
            return tags.create(attrs);
        });

        server.get('/tags/', (0, _utils.paginatedResponse)('tags'));

        server.get('/tags/slug/:slug/', function (_ref2, _ref3) {
            var tags = _ref2.tags;
            var slug = _ref3.params.slug;

            // TODO: remove post_count unless requested?
            return tags.findBy({ slug: slug });
        });

        server.put('/tags/:id/');

        server.del('/tags/:id/');
    }
});