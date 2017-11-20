define('code-corps-ember/mirage/factories/project', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var String = Ember.String;
  exports.default = _emberCliMirage.Factory.extend({
    closedTasksCount: 0,
    description: _emberCliMirage.faker.lorem.sentence,
    iconLargeUrl: _emberCliMirage.faker.image.imageUrl,
    iconThumbUrl: _emberCliMirage.faker.image.imageUrl,
    openTasksCount: 0,
    title: _emberCliMirage.faker.name.title,
    website: _emberCliMirage.faker.url,

    slug: function slug() {
      if (this.title) {
        return String.underscore(this.title.toLowerCase());
      }
    },


    // ensures associations exist if they haven't been provided
    afterCreate: function afterCreate(project, server) {
      if (!project.organization) {
        project.organization = server.create('organization');
        project.save();
      }
    }
  });
});