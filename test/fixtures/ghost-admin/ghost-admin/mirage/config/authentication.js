define('ghost-admin/mirage/config/authentication', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = mockAuthentication;
    var isBlank = Ember.isBlank;
    function mockAuthentication(server) {
        server.post('/authentication/token', function () {
            // Password sign-in
            return {
                access_token: 'MirageAccessToken',
                expires_in: 172800,
                refresh_token: 'MirageRefreshToken',
                token_type: 'Bearer'
            };
        });

        server.post('/authentication/passwordreset', function (schema, request) {
            var _JSON$parse = JSON.parse(request.requestBody),
                passwordreset = _JSON$parse.passwordreset;

            // eslint-disable-next-line ember-suave/prefer-destructuring
            var email = passwordreset[0].email;

            if (email === 'unknown@example.com') {
                return new _emberCliMirage.Response(404, {}, {
                    errors: [{
                        message: 'There is no user with that email address.',
                        errorType: 'NotFoundError'
                    }]
                });
            } else {
                return {
                    passwordreset: [{ message: 'Check your email for further instructions.' }]
                };
            }
        });

        server.get('/authentication/invitation/', function (schema, request) {
            var email = request.queryParams.email;

            var invite = schema.invites.findBy({ email: email });
            var user = schema.users.find(invite.createdBy);
            var valid = !!invite;
            var invitedBy = user && user.name;

            return {
                invitation: [{
                    valid: valid,
                    invitedBy: invitedBy
                }]
            };
        });

        /* Setup ---------------------------------------------------------------- */

        server.post('/authentication/setup', function (_ref) {
            var roles = _ref.roles,
                users = _ref.users;

            var attrs = this.normalizedRequestAttrs();
            var role = roles.findBy({ name: 'Owner' });

            // create owner role unless already exists
            if (!role) {
                role = roles.create({ name: 'Owner' });
            }
            attrs.roles = [role];

            if (!isBlank(attrs.email)) {
                attrs.slug = attrs.email.split('@')[0].dasherize();
            }

            // NOTE: server does not use the user factory to fill in blank fields
            return users.create(attrs);
        });

        server.get('/authentication/setup/', function () {
            return {
                setup: [{ status: true }]
            };
        });
    }
});