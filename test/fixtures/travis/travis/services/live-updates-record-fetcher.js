define('travis/services/live-updates-record-fetcher', ['exports', 'ember-concurrency', 'travis/config/environment', 'ember-decorators/service'], function (exports, _emberConcurrency, _environment, _service) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  var _desc, _value, _obj, _init;

  var Service = Ember.Service;
  exports.default = Service.extend((_obj = { store: null,

    init: function init() {
      this.recordsToFetch = [];

      return this._super.apply(this, arguments);
    },
    fetch: function fetch(type, id) {
      var payload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      this.recordsToFetch.push({ type: type, id: id, payload: payload });
      this.get('flushPusherFetches').perform();
    },


    flushPusherFetches: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var interval;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              interval = this.get('interval') || _environment.default.intervals.fetchRecordsForPusherUpdatesThrottle;
              _context.next = 3;
              return (0, _emberConcurrency.timeout)(interval);

            case 3:

              this.fetchRecordsFromPusher();

            case 4:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    })).drop(),

    fetchRecordsFromPusher: function fetchRecordsFromPusher() {
      var _this = this;

      var recordsToFetch = this.recordsToFetch;
      this.recordsToFetch = [];

      var jobsByBuildId = {};
      var buildIds = [];

      recordsToFetch.forEach(function (data) {
        var id = parseInt(data.id);
        if (data.type == 'job') {
          var buildId = data.payload.build_id;
          jobsByBuildId[buildId] = jobsByBuildId[buildId] || [];
          if (!jobsByBuildId[buildId].includes(id)) {
            jobsByBuildId[buildId].push(id);
          }
        } else if (data.type == 'build' && !buildIds.includes(id)) {
          buildIds.push(id);
        }
      });

      Object.keys(jobsByBuildId).forEach(function (buildId) {
        buildId = parseInt(buildId);
        var jobsData = jobsByBuildId[buildId];
        var needToFetchBuild = buildIds.includes(buildId);

        // if we need to fetch build anyway or if we have more than one build,
        // just query for the build with jobs included
        if (needToFetchBuild || jobsData.length > 1) {
          var index = buildIds.indexOf(buildId);
          buildIds.splice(index, 1);
          _this.get('store').queryRecord('build', { id: buildId, include: 'build.jobs' });
        } else {
          _this.get('store').findRecord('job', jobsData[0], { reload: true });
        }
      });

      buildIds.forEach(function (id) {
        _this.get('store').findRecord('build', id, { reload: true });
      });
    }
  }, (_applyDecoratedDescriptor(_obj, 'store', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'store'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj)), _obj));
});