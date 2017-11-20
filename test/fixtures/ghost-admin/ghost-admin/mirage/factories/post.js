define('ghost-admin/mirage/factories/post', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberCliMirage.Factory.extend({
        uuid: function uuid(i) {
            return 'post-' + i;
        },
        title: function title(i) {
            return 'Post ' + i;
        },
        description: function description(i) {
            return 'Title for post ' + i + '.';
        },
        slug: function slug(i) {
            return 'post-' + i;
        },
        html: function html(i) {
            return '<p>HTML for post ' + i + '.</p>';
        },
        plaintext: function plaintext(i) {
            return 'Plaintext for post ' + i + '.';
        },
        featureImage: function featureImage(i) {
            return '/content/images/2015/10/post-' + i + '.jpg';
        },

        featured: false,
        page: false,
        status: function status(i) {
            return _emberCliMirage.faker.list.cycle('draft', 'published', 'scheduled')(i);
        },
        metaDescription: function metaDescription(i) {
            return 'Meta description for post ' + i + '.';
        },
        metaTitle: function metaTitle(i) {
            return 'Meta Title for post ' + i;
        },

        authorId: 1,
        updatedAt: '2015-10-19T16:25:07.756Z',
        updatedBy: 1,
        publishedAt: '2015-12-19T16:25:07.000Z',
        publishedBy: 1,
        createdAt: '2015-09-11T09:44:29.871Z',
        createdBy: 1,
        tags: []
    });
});