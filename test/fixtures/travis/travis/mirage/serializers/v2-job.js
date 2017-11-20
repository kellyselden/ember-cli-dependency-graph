define('travis/mirage/serializers/v2-job', ['exports', 'travis/mirage/serializers/v2'], function (exports, _v) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _v.default.extend({
    serialize: function serialize(job /* , request */) {
      var _this = this;

      if (job.models) {
        var response = {
          jobs: job.models.map(function (j) {
            return _this.normalizeAttrs(j.attrs);
          }),
          commits: job.models.map(function (j) {
            return _this.normalizeAttrs(j.commit.attrs);
          })
        };

        return response;
      } else {
        var _response = {
          job: this.normalizeAttrs(job.attrs)
        };

        if (job.commit) {
          _response.commit = this.normalizeAttrs(job.commit.attrs);
        }

        return _response;
      }
    },
    normalizeAttrs: function normalizeAttrs(attrs) {
      var newAttrs = {};

      Object.keys(attrs).forEach(function (key) {
        newAttrs[Ember.String.underscore(key)] = attrs[key];
      });

      return newAttrs;
    }
  });
});