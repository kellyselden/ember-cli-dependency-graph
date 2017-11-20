define('percy-web/models/project', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed;
  var not = Ember.computed.not;
  exports.default = _emberData.default.Model.extend({
    organization: _emberData.default.belongsTo('organization', { async: false }),
    name: _emberData.default.attr(),
    slug: _emberData.default.attr(),
    fullSlug: _emberData.default.attr(),
    isEnabled: _emberData.default.attr('boolean'),
    isDisabled: not('isEnabled'),
    diffBase: _emberData.default.attr(), // Either "automatic" or "manual".
    createdAt: _emberData.default.attr('date'),
    updatedAt: _emberData.default.attr('date'),

    // Repo will be set if this project is linked to a GitHub repository.
    repo: _emberData.default.belongsTo('repo', { async: false }),

    builds: _emberData.default.hasMany('build', { async: true }),
    tokens: _emberData.default.hasMany('token', { async: true }),

    recentBuilds: computed('organization', 'slug', 'builds', function () {
      return this.store.query('build', { project: this, page: { limit: 2 } });
    }),

    writeOnlyToken: computed('tokens', function () {
      // Right now the tokens API only returns a list of one write-only token.
      return this.get('tokens.firstObject');
    })
  });
});