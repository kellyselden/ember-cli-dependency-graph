define('percy-web/mirage/scenarios/default', ['exports', 'moment'], function (exports, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (server) {
    server.logging = true;

    var user = server.create('user', { _currentLoginInTest: true });
    var subscription = server.create('subscription', { billingEmail: 'foo@bar.com' });
    var organization = server.create('organization', { subscription: subscription });
    server.create('organizationUser', { user: user, organization: organization, role: 'admin' });

    var project = server.create('project', { organization: organization });
    var headBuild = server.create('build', { project: project, createdAt: (0, _moment.default)().subtract(2, 'minutes') });
    var headSnapshot = server.create('comparison', { headBuild: headBuild }).headSnapshot;
    server.create('comparison', 'mobile', { headBuild: headBuild, headSnapshot: headSnapshot });
    headSnapshot = server.create('comparison', 'gotLonger', { headBuild: headBuild }).headSnapshot;
    server.create('comparison', 'mobile', 'gotLonger', { headBuild: headBuild, headSnapshot: headSnapshot });
    headSnapshot = server.create('comparison', 'gotShorter', { headBuild: headBuild }).headSnapshot;
    server.create('comparison', 'mobile', 'gotShorter', { headBuild: headBuild, headSnapshot: headSnapshot });
    headSnapshot = server.create('comparison', 'wasAdded', { headBuild: headBuild }).headSnapshot;
    server.create('comparison', 'mobile', 'wasAdded', { headBuild: headBuild, headSnapshot: headSnapshot });
    headSnapshot = server.create('comparison', 'wasRemoved', { headBuild: headBuild }).headSnapshot;
    server.create('comparison', 'mobile', 'wasRemoved', { headBuild: headBuild, headSnapshot: headSnapshot });
    headSnapshot = server.create('comparison', 'same', { headBuild: headBuild }).headSnapshot;
    server.create('comparison', 'mobile', 'same', { headBuild: headBuild, headSnapshot: headSnapshot });
  };
});