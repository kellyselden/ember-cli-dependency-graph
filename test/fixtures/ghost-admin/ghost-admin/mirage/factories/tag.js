define('ghost-admin/mirage/factories/tag', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberCliMirage.Factory.extend({
        createdAt: '2015-09-11T09:44:29.871Z',
        createdBy: 1,
        description: function description(i) {
            return 'Description for tag ' + i + '.';
        },

        visibility: 'public',
        featureImage: function featureImage(i) {
            return '/content/images/2015/10/tag-' + i + '.jpg';
        },
        metaDescription: function metaDescription(i) {
            return 'Meta description for tag ' + i + '.';
        },
        metaTitle: function metaTitle(i) {
            return 'Meta Title for tag ' + i;
        },
        name: function name(i) {
            return 'Tag ' + i;
        },

        parent: null,
        slug: function slug(i) {
            return 'tag-' + i;
        },

        updatedAt: '2015-10-19T16:25:07.756Z',
        updatedBy: 1,
        count: function count() {
            return {
                posts: 1
            };
        }
    });
});