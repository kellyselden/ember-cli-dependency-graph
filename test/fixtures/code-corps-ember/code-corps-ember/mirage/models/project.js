define('code-corps-ember/mirage/models/project', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Model.extend({
    donationGoals: (0, _emberCliMirage.hasMany)('donation-goal'),
    githubRepos: (0, _emberCliMirage.hasMany)('github-repo'),
    organization: (0, _emberCliMirage.belongsTo)(),
    projectCategories: (0, _emberCliMirage.hasMany)('project-category'),
    projectSkills: (0, _emberCliMirage.hasMany)('project-skill'),
    projectUsers: (0, _emberCliMirage.hasMany)('project-user'),
    stripeConnectPlan: (0, _emberCliMirage.belongsTo)('stripe-connect-plan'),
    taskLists: (0, _emberCliMirage.hasMany)('task-list'),
    tasks: (0, _emberCliMirage.hasMany)()
  });
});