define('ghost-admin/mirage/config/invites', ['exports', 'moment', 'ember-cli-mirage', 'ghost-admin/mirage/utils'], function (exports, _moment, _emberCliMirage, _utils) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = mockInvites;
    function mockInvites(server) {
        server.get('/invites/', (0, _utils.paginatedResponse)('invites'));

        server.get('/invites/:id', function (schema, request) {
            var id = request.params.id;

            var invite = schema.invites.find(id);

            return invite || new _emberCliMirage.Response(404, {}, {
                errors: [{
                    errorType: 'NotFoundError',
                    message: 'Invite not found.'
                }]
            });
        });

        server.post('/invites/', function (_ref) {
            var invites = _ref.invites;

            var attrs = this.normalizedRequestAttrs();
            var oldInvite = invites.findBy({ email: attrs.email });

            if (oldInvite) {
                oldInvite.destroy();
            }

            /* eslint-disable camelcase */
            attrs.token = invites.all().models.length + '-token';
            attrs.expires = _moment.default.utc().add(1, 'day').valueOf();
            attrs.createdAt = _moment.default.utc().format();
            attrs.createdBy = 1;
            attrs.updatedAt = _moment.default.utc().format();
            attrs.updatedBy = 1;
            attrs.status = 'sent';
            /* eslint-enable camelcase */

            return invites.create(attrs);
        });

        server.del('/invites/:id/');
    }
});