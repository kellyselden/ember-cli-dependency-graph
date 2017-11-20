define('travis/services/update-times', ['exports', 'travis/config/environment', 'travis/utils/eventually', 'npm:visibilityjs'], function (exports, _environment, _eventually, _npmVisibilityjs) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var bind = Ember.run.bind;
  var Service = Ember.Service;
  exports.default = Service.extend({
    records: [],
    allowFinishedBuilds: false,

    init: function init() {
      var visibilityId = _npmVisibilityjs.default.every(_environment.default.intervals.updateTimes, bind(this, 'updateTimes'));
      this.set('visibilityId', visibilityId);
      var intervalId = setInterval(this.resetAllowFinishedBuilds.bind(this), 60000);
      this.set('intervalId', intervalId);

      return this._super.apply(this, arguments);
    },
    willDestroy: function willDestroy() {
      _npmVisibilityjs.default.stop(this.get('visibilityId'));
      clearInterval(this.get('intervalId'));
      this._super.apply(this, arguments);
    },
    resetAllowFinishedBuilds: function resetAllowFinishedBuilds() {
      this.set('allowFinishedBuilds', true);
    },
    updateTimes: function updateTimes() {
      var _this = this;

      var records = this.get('records');

      records.filter(function (record) {
        return _this.get('allowFinishedBuilds') || !record.get('isFinished');
      }).forEach(function (record) {
        (0, _eventually.default)(record, function (resolvedRecord) {
          if (resolvedRecord) {
            resolvedRecord.updateTimes();
          }
        });
      });

      this.set('records', []);

      if (this.get('allowFinishedBuilds')) {
        this.set('allowFinishedBuilds', false);
      }
    },
    pushObject: function pushObject(record) {
      var records = this.get('records');

      if (!records.includes(record)) {
        records.pushObject(record);
      }
    },
    push: function push(model) {
      var _this2 = this;

      if (!model) {
        return;
      }

      if (model.forEach) {
        model.forEach(function (element) {
          _this2.pushObject(element);
        });
      } else {
        this.pushObject(model);
      }
    }
  });
});