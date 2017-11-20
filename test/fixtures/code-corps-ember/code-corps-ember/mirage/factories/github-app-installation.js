define('code-corps-ember/mirage/factories/github-app-installation', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Factory.extend({
    githubAccountAvatarUrl: _emberCliMirage.faker.image.imageUrl,
    githubAccountLogin: _emberCliMirage.faker.internet.domainWord,
    githubAccountType: _emberCliMirage.faker.list.cycle('Organization', 'User')
  });
});