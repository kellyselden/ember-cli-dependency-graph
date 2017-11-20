define('percy-web/tests/factories/build', ['ember-data-factory-guy', 'moment', 'faker'], function (_emberDataFactoryGuy, _moment, _faker) {
  'use strict';

  _emberDataFactoryGuy.default.define('build', {
    sequences: {
      buildNumber: function buildNumber(num) {
        return num;
      }
    },
    default: {
      buildNumber: _emberDataFactoryGuy.default.generate('buildNumber'),
      state: 'pending',
      branch: 'master',
      userAgent: function userAgent() {
        return _faker.default.lorem.slug(10);
      },
      createdAt: function createdAt() {
        return new Date();
      },
      updatedAt: function updatedAt() {
        return new Date();
      },
      commit: _emberDataFactoryGuy.default.belongsTo('commit')
    },
    traits: {
      withLongBranch: { branch: function branch() {
          return _faker.default.lorem.slug(20);
        } },
      withBaseBuild: { baseBuild: { baseBuild: _emberDataFactoryGuy.default.belongsTo('build') } },
      withRepo: { repo: _emberDataFactoryGuy.default.belongsTo('repo') },
      finished: {
        state: 'finished',
        finishedAt: function finishedAt() {
          return (0, _moment.default)().add(2, 'minutes').add(31, 'seconds');
        },
        totalComparisonsDiff: 10,
        totalComparisonsFinished: 15
      },
      pending: { state: 'pending' },
      processing: { state: 'processing' },
      failed: { state: 'failed' },
      expired: { state: 'expired' },
      noDiffs: {
        totalComparisonsDiff: 0,
        totalComparisonsFinished: 12
      },
      missingResources: { failureReason: 'missing_resources' },
      noSnapshots: { failureReason: 'no_snapshots' },
      renderTimeout: { failureReason: 'render_timeout' },
      hasPullRequest: {
        isPullRequest: true,
        pullRequestNumber: 123,
        pullRequestTitle: function pullRequestTitle() {
          return _faker.default.lorem.sentence(5);
        }
      },
      hasPullRequestWithoutTitle: {
        isPullRequest: true,
        pullRequestNumber: 456
      },

      // TODO: refactor these commit message customizations out of this build factory
      // https://github.com/percy/percy-web/pull/154#discussion_r129167477
      withLongHeadCommitMessage: {
        commit: _emberDataFactoryGuy.default.belongsTo('commit', 'longMessage')
      },
      withNoSpacesMessageCommitMessage: {
        commit: _emberDataFactoryGuy.default.belongsTo('commit', 'noSpacesMessage')
      }
    }
  });
});