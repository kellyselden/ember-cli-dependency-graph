define('ghost-admin/mirage/config', ['exports', 'ghost-admin/mirage/config/authentication', 'ghost-admin/mirage/config/configuration', 'ghost-admin/mirage/config/invites', 'ghost-admin/mirage/config/posts', 'ghost-admin/mirage/config/roles', 'ghost-admin/mirage/config/settings', 'ghost-admin/mirage/config/slugs', 'ghost-admin/mirage/config/subscribers', 'ghost-admin/mirage/config/tags', 'ghost-admin/mirage/config/themes', 'ghost-admin/mirage/config/uploads', 'ghost-admin/mirage/config/users'], function (exports, _authentication, _configuration, _invites, _posts, _roles, _settings, _slugs, _subscribers, _tags, _themes, _uploads, _users) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    exports.default = function () {
        // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
        this.namespace = '/ghost/api/v0.1'; // make this `api`, for example, if your API is namespaced
        this.timing = 400; // delay for each request, automatically set to 0 during testing

        // Mock endpoints here to override real API requests during development, eg...
        // this.put('/posts/:id/', versionMismatchResponse);
        // mockTags(this);
        // this.loadFixtures('settings');

        // keep this line, it allows all other API requests to hit the real server
        this.passthrough();

        // add any external domains to make sure those get passed through too
        this.passthrough('https://count.ghost.org/');
        this.passthrough('http://www.gravatar.com/**');
    };

    exports.testConfig = testConfig;


    // Mock all endpoints here as there is no real API during testing
    function testConfig() {
        this.passthrough('/write-coverage'); // For code coverage
        // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
        this.namespace = '/ghost/api/v0.1'; // make this `api`, for example, if your API is namespaced
        // this.timing = 400;      // delay for each request, automatically set to 0 during testing
        // this.logging = true;

        (0, _authentication.default)(this);
        (0, _configuration.default)(this);
        (0, _invites.default)(this);
        (0, _posts.default)(this);
        (0, _roles.default)(this);
        (0, _settings.default)(this);
        (0, _slugs.default)(this);
        (0, _subscribers.default)(this);
        (0, _tags.default)(this);
        (0, _themes.default)(this);
        (0, _uploads.default)(this);
        (0, _users.default)(this);

        /* Notifications -------------------------------------------------------- */

        this.get('/notifications/');

        /* Apps - Slack Test Notification --------------------------------------- */

        this.post('/slack/test', function () {
            return {};
        });

        /* External sites ------------------------------------------------------- */

        var downloadCount = 0;
        this.get('https://count.ghost.org/', function () {
            downloadCount++;
            return {
                count: downloadCount
            };
        });

        this.head('http://www.gravatar.com/avatar/:md5', function () {
            return '';
        }, 200);

        this.get('http://www.gravatar.com/avatar/:md5', function () {
            return '';
        }, 200);
    }

    // import {versionMismatchResponse} from 'utils';
});