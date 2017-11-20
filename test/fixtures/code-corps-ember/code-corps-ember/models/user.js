define('code-corps-ember/models/user', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships'], function (exports, _model, _attr, _relationships) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed;
  exports.default = _model.default.extend({
    admin: (0, _attr.default)(),
    biography: (0, _attr.default)(),
    cloudinaryPublicId: (0, _attr.default)(),
    email: (0, _attr.default)(),
    firstName: (0, _attr.default)(),
    githubAvatarUrl: (0, _attr.default)(),
    githubId: (0, _attr.default)(),
    githubUsername: (0, _attr.default)(),
    insertedAt: (0, _attr.default)('date'),
    intercomUserHash: (0, _attr.default)(),
    lastName: (0, _attr.default)(),
    name: (0, _attr.default)(),
    password: (0, _attr.default)(),
    photoLargeUrl: (0, _attr.default)(),
    photoThumbUrl: (0, _attr.default)(),
    signUpContext: (0, _attr.default)(),
    state: (0, _attr.default)(),
    twitter: (0, _attr.default)(),
    username: (0, _attr.default)(),
    website: (0, _attr.default)(),

    stateTransition: (0, _attr.default)(),

    githubAppInstallations: (0, _relationships.hasMany)('github-app-installation', { async: true }),

    projectUsers: (0, _relationships.hasMany)('project-user', { async: true }),

    stripeConnectSubscriptions: (0, _relationships.hasMany)('stripe-connect-subscription', { async: true }),
    stripePlatformCard: (0, _relationships.belongsTo)('stripe-platform-card', { async: true }),
    stripePlatformCustomer: (0, _relationships.belongsTo)('stripe-platform-customer', { async: true }),

    userCategories: (0, _relationships.hasMany)('user-category', { async: true }),
    userRoles: (0, _relationships.hasMany)('user-role', { async: true }),
    userSkills: (0, _relationships.hasMany)('user-skill', { async: true }),

    atUsername: computed('username', function () {
      return '@' + this.get('username');
    }),

    twitterUrl: computed('twitter', function () {
      return 'https://twitter.com/' + this.get('twitter');
    })
  });
});