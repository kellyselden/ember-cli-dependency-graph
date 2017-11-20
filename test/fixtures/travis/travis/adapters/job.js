define('travis/adapters/job', ['exports', 'travis/adapters/v3'], function (exports, _v) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _v.default.extend({
    coalesceFindRequests: true,

    groupRecordsForFindMany: function groupRecordsForFindMany(store, snapshots) {
      var jobsByBuildId = {};
      var jobsWithoutBuildId = [];

      snapshots.forEach(function (snapshot) {
        var build = snapshot.belongsTo('build');
        if (build) {
          if (!jobsByBuildId[build.id]) {
            jobsByBuildId[build.id] = [];
          }

          jobsByBuildId[build.id].push(snapshot);
        } else {
          jobsWithoutBuildId.push([snapshot]);
        }
      });

      return Object.values(jobsByBuildId).concat(jobsWithoutBuildId);
    },
    findMany: function findMany(store, modelClass, ids, snapshots) {
      var build = snapshots[0].belongsTo('build');
      if (build) {
        return this.ajax(this.buildURL() + '/build/' + build.id + '/jobs');
      } else {
        return this.ajax(this.buildURL() + '/job/' + snapshots[0].id);
      }
    }
  });
});