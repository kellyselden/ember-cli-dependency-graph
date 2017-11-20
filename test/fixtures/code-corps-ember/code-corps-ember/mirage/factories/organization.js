define('code-corps-ember/mirage/factories/organization', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Factory.extend({
    name: _emberCliMirage.faker.internet.userName,
    description: _emberCliMirage.faker.lorem.paragraph,
    iconThumbUrl: _emberCliMirage.faker.image.imageUrl,
    iconLargeUrl: _emberCliMirage.faker.image.imageUrl,

    slug: function slug() {
      if (this.name) {
        return this.name.toLowerCase();
      }
    },


    // in real-life scenarios, a organization must necessarily have an owner
    // this is not the case in mirage, so we make it so
    afterCreate: function afterCreate(organization, server) {
      if (!organization.owner) {
        organization.owner = server.create('user');
        organization.save();
      }

      if (!organization.sluggedRoute) {
        organization.sluggedRoute = server.create('slugged-route', { slug: organization.slug, organization: organization });
        organization.save();
      }
    }
  });
});