define('percy-web/models/build', ['exports', 'ember-data', 'moment'], function (exports, _emberData, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var computed = Ember.computed;
  var bool = Ember.computed.bool;
  var and = Ember.computed.and;
  var equal = Ember.computed.equal;
  var max = Ember.computed.max;
  exports.default = _emberData.default.Model.extend({
    project: _emberData.default.belongsTo('project', { async: false }),
    repo: _emberData.default.belongsTo('repo', { async: false }),

    // Check isGithubLinked before accessing repo.
    isGithubLinked: bool('repo'),

    isGithubPullRequest: and('isGithubLinked', 'isPullRequest'),

    buildNumber: _emberData.default.attr('number'),
    buildTitle: computed('buildNumber', function () {
      return 'Build #' + this.get('buildNumber');
    }),
    branch: _emberData.default.attr(),

    // States.
    state: _emberData.default.attr(),
    isPending: equal('state', 'pending'),
    isProcessing: equal('state', 'processing'),
    isFinished: equal('state', 'finished'),
    isFailed: equal('state', 'failed'),
    isExpired: equal('state', 'expired'),

    failureReason: _emberData.default.attr(),
    failureReasonHumanized: computed('failureReason', function () {
      var failureReason = this.get('failureReason');
      if (failureReason === 'missing_resources') {
        return 'Missing resources';
      } else if (failureReason === 'no_snapshots') {
        return 'No snapshots';
      } else if (failureReason === 'render_timeout') {
        return 'Timed out';
      }
    }),

    commit: _emberData.default.belongsTo('commit', { async: false }), // Might be null.
    baseBuild: _emberData.default.belongsTo('build', { async: false, inverse: null }),
    comparisons: _emberData.default.hasMany('comparison', { async: true }),

    snapshots: computed('comparisons', function () {
      var comparisons = this.get('comparisons');
      var snapshots = comparisons.map(function (comparison) {
        return comparison.get('headSnapshot');
      }).filter(function (x) {
        return x;
      });
      return [].concat(_toConsumableArray(new Set(snapshots)));
    }),

    comparisonWidths: computed('comparisons', function () {
      var widths = [].concat(_toConsumableArray(new Set(this.get('comparisons').map(function (c) {
        return c.get('width');
      }))));
      return widths.sort(function (a, b) {
        return a - b;
      });
    }),

    defaultSelectedWidth: max('comparisonWidths'),
    numComparisonWidths: computed('comparisonWidths', function () {
      return this.get('comparisonWidths').length;
    }),

    totalComparisonsFinished: _emberData.default.attr('number'),
    totalComparisonsDiff: _emberData.default.attr('number'),
    hasDiffs: computed('totalComparisonsDiff', function () {
      // Only have the chance to return true if the build is finished.
      if (!this.get('isFinished')) {
        return false;
      }
      return this.get('totalComparisonsDiff') > 0;
    }),

    isPullRequest: _emberData.default.attr('boolean'),
    pullRequestNumber: _emberData.default.attr('number'),
    pullRequestTitle: _emberData.default.attr(),

    finishedAt: _emberData.default.attr('date'),
    approvedAt: _emberData.default.attr('date'),
    approvedBy: _emberData.default.belongsTo('user', { async: false }),
    createdAt: _emberData.default.attr('date'),
    updatedAt: _emberData.default.attr('date'),
    userAgent: _emberData.default.attr(),

    duration: computed('finishedAt', 'createdAt', function () {
      var finished = this.get('finishedAt');
      if (!finished) {
        finished = (0, _moment.default)();
      }
      var started = this.get('createdAt');
      var milliseconds = (0, _moment.default)(finished).diff(started);
      return _moment.default.duration(milliseconds);
    }),

    // Convenience methods for accessing common methods in templates.
    durationHours: computed('duration', function () {
      return this.get('duration').hours();
    }),
    durationMinutes: computed('duration', function () {
      return this.get('duration').minutes();
    }),
    durationSeconds: computed('duration', function () {
      return this.get('duration').seconds();
    }),

    isApproved: computed('approvedAt', function () {
      return !!this.get('approvedAt');
    }),

    reloadAll: function reloadAll() {
      this.store.findRecord('build', this.get('id'), { reload: true });
    }
  });
});