define('travis/utils/dashboard-repositories-sort', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var isBlank = Ember.isBlank;

  exports.default = function (a, b) {
    if (isBlank(a.get('currentBuild.state'))) {
      return 1;
    }
    if (isBlank(b.get('currentBuild.state'))) {
      return -1;
    }
    if (isBlank(a.get('currentBuild.finishedAt'))) {
      return -1;
    }
    if (isBlank(b.get('currentBuild.finishedAt'))) {
      return 1;
    }
    if (a.get('currentBuild.finishedAt') < b.get('currentBuild.finishedAt')) {
      return 1;
    }
    if (a.get('currentBuild.finishedAt') > b.get('currentBuild.finishedAt')) {
      return -1;
    }
    if (a.get('currentBuild.finishedAt') === b.get('currentBuild.finishedAt')) {
      return 0;
    }
    if (isBlank(a.get('defaultBranch.lastBuild.state'))) {
      return 1;
    }
    if (isBlank(b.get('defaultBranch.lastBuild.state'))) {
      return -1;
    }
  };
});