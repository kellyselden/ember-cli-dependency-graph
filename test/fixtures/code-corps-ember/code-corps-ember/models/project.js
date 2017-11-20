define('code-corps-ember/models/project', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships'], function (exports, _model, _attr, _relationships) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var gt = Ember.computed.gt;
  var filterBy = Ember.computed.filterBy;
  var get = Ember.get;
  var computed = Ember.computed;
  exports.default = _model.default.extend({
    approved: (0, _attr.default)(),
    canActivateDonations: (0, _attr.default)(),
    closedTasksCount: (0, _attr.default)('number'),
    cloudinaryPublicId: (0, _attr.default)(),
    description: (0, _attr.default)(),
    donationsActive: (0, _attr.default)(),
    githubId: (0, _attr.default)(),
    iconLargeUrl: (0, _attr.default)(),
    iconThumbUrl: (0, _attr.default)(),
    longDescriptionBody: (0, _attr.default)(),
    longDescriptionMarkdown: (0, _attr.default)(),
    openTasksCount: (0, _attr.default)('number'),
    shouldLinkExternally: (0, _attr.default)(),
    slug: (0, _attr.default)(),
    title: (0, _attr.default)(),
    totalMonthlyDonated: (0, _attr.default)('dollar-cents'),
    website: (0, _attr.default)(),

    donationGoals: (0, _relationships.hasMany)('donation-goal', { async: true }),
    githubRepos: (0, _relationships.hasMany)('github-repo', { async: true }),
    organization: (0, _relationships.belongsTo)('organization', { async: true }),
    taskLists: (0, _relationships.hasMany)('task-list', { async: true }),
    tasks: (0, _relationships.hasMany)('tasks', { async: true }),
    projectCategories: (0, _relationships.hasMany)('project-category', { async: true }),
    projectSkills: (0, _relationships.hasMany)('project-skill', { async: true }),
    projectUsers: (0, _relationships.hasMany)('project-user', { async: true }),
    stripeConnectPlan: (0, _relationships.belongsTo)('stripe-connect-plan', { async: true }),

    currentDonationGoal: computed('_currentGoals', function () {
      return get(this, '_currentGoals.firstObject');
    }),
    hasOpenTasks: gt('openTasksCount', 0),

    _currentGoals: filterBy('donationGoals', 'current', true)
  });
});