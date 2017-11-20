define('travis/services/pusher', ['exports', 'travis/config/environment', 'ember-decorators/service'], function (exports, _environment, _service) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

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

  var _desc, _value, _obj, _init, _init2;

  var Service = Ember.Service;
  var later = Ember.run.later;
  exports.default = Service.extend((_obj = { store: null,
    liveUpdatesRecordFetcher: null,

    receive: function receive(event, data) {
      var build = void 0,
          commit = void 0,
          job = void 0;
      var store = this.get('store');

      var _event$split = event.split(':'),
          _event$split2 = _slicedToArray(_event$split, 2),
          name = _event$split2[0],
          type = _event$split2[1];

      if (name === 'job' && data.job && data.job.commit) {
        store.push(store.normalize('commit', data.job.commit));
      }

      if (name === 'build' && data.build && data.build.commit) {
        build = data.build;
        commit = {
          id: build.commit_id,
          author_email: build.author_email,
          author_name: build.author_name,
          branch: build.branch,
          committed_at: build.committed_at,
          committer_email: build.committer_email,
          committer_name: build.committer_name,
          compare_url: build.compare_url,
          message: build.message,
          sha: build.commit
        };
        delete data.build.commit;
        store.push(store.normalize('commit', commit));
      }

      if (name === 'branch') {
        // force reload of repo branches
        // delay to resolve race between github-sync and live
        var branchName = data.branch;

        later(function () {
          store.findRecord('branch', '/repo/' + data.repository_id + '/branch/' + branchName);
        }, _environment.default.intervals.branchCreatedSyncDelay);

        delete data.branch;
      }

      if (event === 'job:log') {
        data = data.job;
        job = store.recordForId('job', data.id);
        return job.appendLog({
          number: parseInt(data.number),
          content: data._log,
          final: data.final
        });
      } else if (data[name]) {
        if (data._no_full_payload) {
          // if payload is too big, travis-live will send us only the id of the
          // object or id with build_id for jobs. If that happens, just load the
          // object from the API
          var payload = {};
          if (name === 'job') {
            payload['build_id'] = data.job.build_id;
          }
          this.get('liveUpdatesRecordFetcher').fetch(name, data[name].id, payload);
        } else {
          return this.loadOne(name, data);
        }
      } else {
        if (!type) {
          throw 'can\'t load data for ' + name;
        }
      }
    },
    loadOne: function loadOne(type, json) {
      var data = void 0,
          defaultBranch = void 0,
          lastBuildId = void 0;
      var store = this.get('store');

      store.push(store.normalize(type, json));

      // we get other types of records only in a few situations and
      // it's not always needed to update data, so I'm specyfing which
      // things I want to update here:
      if (type === 'build' && (json.repository || json.repo)) {
        data = json.repository || json.repo;
        defaultBranch = data.default_branch;
        if (defaultBranch) {
          defaultBranch.default_branch = true;
          defaultBranch['@href'] = '/repo/' + data.id + '/branch/' + defaultBranch.name;
        }
        lastBuildId = defaultBranch.last_build_id;

        // a build is a synchronous relationship on a branch model, so we need to
        // have a build record present when we put default_branch from a repository
        // model into the store. We don't send last_build's payload in pusher, so
        // we need to get it here, if it's not already in the store. In the future
        // we may decide to make this relationship async, but I don't want to
        // change the code at the moment
        var lastBuild = store.peekRecord('build', lastBuildId);
        if (!lastBuildId || lastBuild) {
          return store.push(store.normalize('repo', data));
        } else {
          return store.findRecord('build', lastBuildId).then(function () {
            store.push(store.normalize('repo', data));
          });
        }
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'store', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'store'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'liveUpdatesRecordFetcher', [_service.service], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'liveUpdatesRecordFetcher'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj)), _obj));
});