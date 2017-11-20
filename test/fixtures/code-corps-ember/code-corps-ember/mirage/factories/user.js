define('code-corps-ember/mirage/factories/user', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Factory.extend({
    admin: false,
    biography: _emberCliMirage.faker.lorem.paragraph,
    email: _emberCliMirage.faker.internet.email,
    photoLargeUrl: _emberCliMirage.faker.image.avatar,
    photoThumbUrl: _emberCliMirage.faker.image.avatar,
    twitter: _emberCliMirage.faker.internet.domainWord,
    username: _emberCliMirage.faker.internet.domainWord,
    website: _emberCliMirage.faker.internet.url,
    base64PhotoData: null,

    // ensures creation of associated records if they were not otherwise specified
    afterCreate: function afterCreate(user, server) {
      if (!user.sluggedRoute) {
        user.sluggedRoute = server.create('slugged-route', { slug: user.username, user: user });
        user.save();
      }
    }
  });
});