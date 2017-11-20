define('ghost-admin/mirage/config/users', ['exports', 'ember-cli-mirage', 'ghost-admin/mirage/utils'], function (exports, _emberCliMirage, _utils) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = mockUsers;
    function mockUsers(server) {
        // /users/me = Always return the user with ID=1
        server.get('/users/me/', function (_ref) {
            var users = _ref.users;

            var user = users.find(1);

            if (user) {
                return user;
            } else {
                return new _emberCliMirage.Response(404, {}, { errors: [{ message: 'Not found', errorType: 'NotFoundError' }] });
            }
        });

        server.get('/users/', function (_ref2, _ref3) {
            var users = _ref2.users;
            var queryParams = _ref3.queryParams;

            var page = +queryParams.page || 1;

            // NOTE: this is naive and only set up to work with queries that are
            // actually used - if you use a different filter in the app, add it here!

            var _users$where = users.where(function (user) {
                var statusMatch = true;

                if (queryParams.filter === 'status:-inactive') {
                    statusMatch = user.status !== 'inactive';
                } else if (queryParams.filter === 'status:inactive') {
                    statusMatch = user.status === 'inactive';
                } else if (queryParams.status && queryParams.status !== 'all') {
                    statusMatch = user.status === queryParams.status;
                }

                return statusMatch;
            }),
                models = _users$where.models;

            return (0, _utils.paginateModelArray)('users', models, page, queryParams.limit);
        });

        server.get('/users/slug/:slug/', function (_ref4, _ref5) {
            var users = _ref4.users;
            var params = _ref5.params,
                queryParams = _ref5.queryParams;

            var user = users.findBy({ slug: params.slug });
            user.postCount = queryParams.include.match(/count\.posts/);
            return user;
        });

        server.get('/users/:id', function (_ref6, _ref7) {
            var users = _ref6.users;
            var params = _ref7.params,
                queryParams = _ref7.queryParams;

            var user = users.find(params.id);
            user.postCount = queryParams.include.match(/count\.posts/);
            return user;
        });

        server.put('/users/:id/', function (_ref8, _ref9) {
            var users = _ref8.users;
            var params = _ref9.params;
            var id = params.id;


            if (id === 'password') {
                return {
                    password: [{ message: 'Password changed successfully.' }]
                };
            } else {
                var attrs = this.normalizedRequestAttrs();

                // TODO: why is our custom serializer causing .update to throw
                // children.update is not a function?
                // https://github.com/samselikoff/ember-cli-mirage/issues/964
                delete attrs.roles;

                return users.find(id).update(attrs);
            }
        });

        server.del('/users/:id/');
    }
});