define('travis/mirage/serializers/owner', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Serializer.extend({
    serialize: function serialize(object) {
      var user = Ember.copy(object.attrs);
      user['@type'] = 'user';

      user.repositories = object._schema.repositories.where(function (repo) {
        return repo.slug.indexOf(user.login) === 0;
      }).models.map(function (repo) {
        var data = Ember.copy(repo.attrs);

        var defaultBranch = repo.branches.models.filterBy('default_branch', true)[0];

        if (defaultBranch) {
          data.default_branch = defaultBranch.attrs;

          var lastBuild = defaultBranch.builds.models[0];

          if (lastBuild) {
            data.default_branch.last_build = lastBuild.attrs;
            data.default_branch.last_build.commit = lastBuild.commit.attrs;
          }
        }

        return data;
      });

      return user;
    }
  });
});