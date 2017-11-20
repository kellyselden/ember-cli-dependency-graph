define('ghost-admin/mirage/config/posts', ['exports', 'ember-cli-mirage', 'ghost-admin/mirage/utils'], function (exports, _emberCliMirage, _utils) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = mockPosts;
    var dasherize = Ember.String.dasherize;
    var isBlank = Ember.isBlank;
    function mockPosts(server) {
        server.post('/posts', function (_ref) {
            var posts = _ref.posts;

            var attrs = this.normalizedRequestAttrs();

            // mirage expects `author` to be a reference but we only have an ID
            attrs.authorId = attrs.author;
            delete attrs.author;

            if (isBlank(attrs.slug) && !isBlank(attrs.title)) {
                attrs.slug = dasherize(attrs.title);
            }

            return posts.create(attrs);
        });

        // TODO: handle author filter
        server.get('/posts/', function (_ref2, _ref3) {
            var posts = _ref2.posts;
            var queryParams = _ref3.queryParams;

            var page = +queryParams.page || 1;
            var limit = +queryParams.limit || 15;
            var status = queryParams.status,
                staticPages = queryParams.staticPages;

            var query = {};
            var models = void 0;

            if (status && status !== 'all') {
                query.status = status;
            }

            if (staticPages === 'false') {
                query.page = false;
            }

            if (staticPages === 'true') {
                query.page = true;
            }

            models = posts.where(query).models;

            return (0, _utils.paginateModelArray)('posts', models, page, limit);
        });

        server.get('/posts/:id/', function (_ref4, _ref5) {
            var posts = _ref4.posts;
            var params = _ref5.params;
            var id = params.id;

            var post = posts.find(id);

            return post || new _emberCliMirage.Response(404, {}, {
                errors: [{
                    errorType: 'NotFoundError',
                    message: 'Post not found.'
                }]
            });
        });

        // Handle embedded author in post
        server.put('/posts/:id/', function (_ref6, request) {
            var posts = _ref6.posts;

            var post = this.normalizedRequestAttrs();
            var author = post.author;

            delete post.author;

            var savedPost = posts.find(request.params.id).update(post);
            savedPost.authorId = author;
            savedPost.save();

            return savedPost;
        });

        server.del('/posts/:id/');
    }
});