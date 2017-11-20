define('ghost-admin/mirage/config/roles', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = mockRoles;
    function mockRoles(server) {
        server.get('/roles/', function (_ref, _ref2) {
            var roles = _ref.roles;
            var queryParams = _ref2.queryParams;

            if (queryParams.permissions === 'assign') {
                return roles.find([1, 2, 3]);
            }

            return roles.all();
        });
    }
});