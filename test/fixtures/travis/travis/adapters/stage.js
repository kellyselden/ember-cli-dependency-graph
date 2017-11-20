define('travis/adapters/stage', ['exports', 'travis/adapters/v3'], function (exports, _v) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _v.default.extend({
    coalesceFindRequests: true,

    groupRecordsForFindMany: function groupRecordsForFindMany(store, snapshots) {
      var stagesByBuildId = {};

      snapshots.forEach(function (snapshot) {
        var buildId = snapshot.belongsTo('build').id;

        if (!stagesByBuildId[buildId]) {
          stagesByBuildId[buildId] = [];
        }

        stagesByBuildId[buildId].push(snapshot);
      });

      return Object.values(stagesByBuildId);
    },
    findMany: function findMany(store, modelClass, ids, snapshots) {
      var buildId = snapshots[0].belongsTo('build').id;
      return this.ajax(this.buildURL() + '/build/' + buildId + '/stages');
    },
    findRecord: function findRecord(store, type, id, snapshot) {
      var buildId = snapshot.belongsTo('build').id;
      // TODO: I'd rather implement /stage/:id endpoint in API, but for now this
      // is a simpler way to fetch a single stage
      return this.ajax(this.buildURL() + '/build/' + buildId + '/stages').then(function (data) {
        return data.stages.filterBy('id', parseInt(id))[0];
      });
    }
  });
});