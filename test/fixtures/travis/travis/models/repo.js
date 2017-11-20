define('travis/models/repo', ['exports', 'travis/utils/expandable-record-array', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships', 'ember-decorators/service', 'ember-decorators/object', 'ember-decorators/object/computed'], function (exports, _expandableRecordArray, _model, _attr, _relationships, _service, _object, _computed) {
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

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _desc, _value, _obj, _init, _init2, _init3, _init4, _init5, _init6;

  var ArrayProxy = Ember.ArrayProxy;
  var EmberPromise = Ember.RSVP.Promise;
  var allSettled = Ember.RSVP.allSettled;
  var $ = Ember.$;
  var A = Ember.A;


  var Repo = _model.default.extend((_dec = (0, _computed.oneWay)('owner.@type'), _dec2 = (0, _computed.oneWay)('currentBuild.finishedAt'), _dec3 = (0, _computed.oneWay)('currentBuild.state'), _dec4 = (0, _computed.oneWay)('currentBuild.id'), _dec5 = (0, _object.computed)('auth.currentUser.permissions.[]'), _dec6 = (0, _object.computed)('id'), _dec7 = (0, _object.computed)('id'), _dec8 = (0, _object.computed)('id'), _dec9 = (0, _object.computed)('id'), _dec10 = (0, _object.computed)('id'), _dec11 = (0, _object.computed)('slug', '_stats'), (_obj = { ajax: null,
    auth: null,
    permissions: (0, _attr.default)(),
    slug: (0, _attr.default)(),
    description: (0, _attr.default)(),
    'private': (0, _attr.default)('boolean'),
    githubLanguage: (0, _attr.default)(),
    active: (0, _attr.default)(),
    owner: (0, _attr.default)(),
    name: (0, _attr.default)(),
    starred: (0, _attr.default)('boolean'),

    ownerType: null,

    currentBuildFinishedAt: null,
    currentBuildState: null,
    currentBuildId: null,

    defaultBranch: (0, _relationships.belongsTo)('branch', {
      async: false
    }),
    currentBuild: (0, _relationships.belongsTo)('build', {
      async: true, inverse: 'repoCurrentBuild'
    }),

    isCurrentUserACollaborator: function isCurrentUserACollaborator(permissions) {
      if (permissions) {
        var id = parseInt(this.get('id'));

        return permissions.includes(id);
      }
    },


    sshKey: function sshKey() {
      this.store.find('ssh_key', this.get('id'));
      return this.store.recordForId('ssh_key', this.get('id'));
    },

    envVars: function envVars(id) {
      return this.store.filter('env_var', {
        repository_id: id
      }, function (v) {
        return v.get('repo.id') === id;
      });
    },
    _buildRepoMatches: function _buildRepoMatches(build, id) {
      // TODO: I don't understand why we need to compare string id's here
      return '' + build.get('repo.id') === '' + id;
    },
    _buildObservableArray: function _buildObservableArray(builds) {
      var array = _expandableRecordArray.default.create({
        type: 'build',
        content: A([])
      });
      array.load(builds);
      array.observe(builds);
      return array;
    },
    builds: function builds(id) {
      var _this = this;

      var builds = this.store.filter('build', {
        event_type: ['push', 'api', 'cron'],
        repository_id: id,
        include: 'build.jobs'
      }, function (b) {
        var eventTypes = ['push', 'api', 'cron'];
        return _this._buildRepoMatches(b, id) && eventTypes.includes(b.get('eventType'));
      });
      return this._buildObservableArray(builds);
    },
    pullRequests: function pullRequests(id) {
      var _this2 = this;

      var builds = this.store.filter('build', {
        event_type: 'pull_request',
        repository_id: id,
        include: 'build.jobs'
      }, function (b) {
        var isPullRequest = b.get('eventType') === 'pull_request';
        return _this2._buildRepoMatches(b, id) && isPullRequest;
      });
      return this._buildObservableArray(builds);
    },
    branches: function branches(id) {
      return this.store.filter('branch', {
        repository_id: id
      }, function (b) {
        return b.get('repoId') === id;
      });
    },
    cronJobs: function cronJobs(id) {
      return this.store.filter('cron', {
        repository_id: id
      }, function (cron) {
        return cron.get('branch.repoId') === id;
      });
    },
    stats: function stats(slug, _stats) {
      var _this3 = this;

      if (slug) {
        return _stats || $.get('https://api.github.com/repos/' + slug, function (data) {
          _this3.set('_stats', data);
          return _this3.notifyPropertyChange('stats');
        }) && {};
      }
    },
    updateTimes: function updateTimes() {
      var currentBuild = this.get('currentBuild');
      if (currentBuild) {
        return currentBuild.updateTimes();
      }
    },
    regenerateKey: function regenerateKey(options) {
      var url = '/repos/' + this.get('id') + '/key';
      return this.get('ajax').ajax(url, 'post', options);
    },
    fetchSettings: function fetchSettings() {
      var _this4 = this;

      var url = '/repo/' + this.get('id') + '/settings';
      return this.get('ajax').ajax(url, 'get', {
        headers: {
          'Travis-API-Version': '3'
        },
        forceAuth: true
      }).then(function (data) {
        return _this4._convertV3SettingsToV2(data['settings']);
      });
    },
    saveSetting: function saveSetting(name, value) {
      return this.get('ajax').ajax('/repo/' + this.get('id') + '/setting/' + name, 'patch', {
        data: {
          'setting.value': value
        }, headers: {
          'Travis-API-Version': '3'
        }
      });
    },
    _convertV3SettingsToV2: function _convertV3SettingsToV2(v3Settings) {
      return v3Settings.reduce(function (v2Settings, v3Setting) {
        if (v3Setting) {
          v2Settings[v3Setting.name] = v3Setting.value;
        }
        return v2Settings;
      }, {});
    },
    toggle: function toggle() {
      var adapter = this.store.adapterFor('repo');
      var id = this.get('id');
      var promise = void 0;
      if (this.get('active')) {
        promise = adapter.deactivate(id);
      } else {
        promise = adapter.activate(id);
      }

      return promise;
    }
  }, (_applyDecoratedDescriptor(_obj, 'ajax', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'ajax'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'auth', [_service.service], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'auth'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'ownerType', [_dec], (_init3 = Object.getOwnPropertyDescriptor(_obj, 'ownerType'), _init3 = _init3 ? _init3.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init3;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'currentBuildFinishedAt', [_dec2], (_init4 = Object.getOwnPropertyDescriptor(_obj, 'currentBuildFinishedAt'), _init4 = _init4 ? _init4.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init4;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'currentBuildState', [_dec3], (_init5 = Object.getOwnPropertyDescriptor(_obj, 'currentBuildState'), _init5 = _init5 ? _init5.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init5;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'currentBuildId', [_dec4], (_init6 = Object.getOwnPropertyDescriptor(_obj, 'currentBuildId'), _init6 = _init6 ? _init6.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init6;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'isCurrentUserACollaborator', [_dec5], Object.getOwnPropertyDescriptor(_obj, 'isCurrentUserACollaborator'), _obj), _applyDecoratedDescriptor(_obj, 'envVars', [_dec6], Object.getOwnPropertyDescriptor(_obj, 'envVars'), _obj), _applyDecoratedDescriptor(_obj, 'builds', [_dec7], Object.getOwnPropertyDescriptor(_obj, 'builds'), _obj), _applyDecoratedDescriptor(_obj, 'pullRequests', [_dec8], Object.getOwnPropertyDescriptor(_obj, 'pullRequests'), _obj), _applyDecoratedDescriptor(_obj, 'branches', [_dec9], Object.getOwnPropertyDescriptor(_obj, 'branches'), _obj), _applyDecoratedDescriptor(_obj, 'cronJobs', [_dec10], Object.getOwnPropertyDescriptor(_obj, 'cronJobs'), _obj), _applyDecoratedDescriptor(_obj, 'stats', [_dec11], Object.getOwnPropertyDescriptor(_obj, 'stats'), _obj)), _obj)));

  Repo.reopenClass({
    recent: function recent() {
      return this.find();
    },
    accessibleBy: function accessibleBy(store, reposIdsOrlogin) {
      var repos = void 0,
          reposIds = void 0;
      reposIds = reposIdsOrlogin;
      repos = store.filter('repo', function (repo) {
        var repoId = parseInt(repo.get('id'));
        return reposIds.includes(repoId);
      });
      return new EmberPromise(function (resolve, reject) {
        var params = {
          'repository.active': 'true',
          sort_by: 'current_build:desc',
          limit: 30
        };
        return store.query('repo', params).then(function () {
          return resolve(repos);
        }, function () {
          return reject();
        });
      });
    },
    search: function search(store, ajax, query) {
      var promise = void 0,
          queryString = void 0,
          result = void 0;
      queryString = $.param({
        search: query,
        orderBy: 'name',
        limit: 5
      });
      var url = '/repos?' + queryString;
      promise = ajax.ajax(url, 'get');
      result = ArrayProxy.create({
        content: []
      });
      return promise.then(function (data) {
        var promises = data.repos.map(function (repoData) {
          var repositoryId = repoData.id;
          return store.findRecord('repo', repositoryId).then(function (record) {
            result.pushObject(record);
            result.set('isLoaded', true);
            return record;
          });
        });
        return allSettled(promises).then(function () {
          return result;
        });
      });
    },
    fetchBySlug: function fetchBySlug(store, slug) {
      var adapter = void 0,
          modelClass = void 0,
          promise = void 0,
          repos = void 0;
      repos = store.peekAll('repo').filterBy('slug', slug);
      if (repos.get('length') > 0) {
        return repos.get('firstObject');
      } else {
        promise = null;
        adapter = store.adapterFor('repo');
        modelClass = store.modelFor('repo');
        promise = adapter.findRecord(store, modelClass, slug).then(function (payload) {
          var i = void 0,
              len = void 0,
              record = void 0,
              ref = void 0,
              repo = void 0,
              result = void 0,
              serializer = void 0;
          serializer = store.serializerFor('repo');
          modelClass = store.modelFor('repo');
          result = serializer.normalizeResponse(store, modelClass, payload, null, 'findRecord');
          repo = store.push({
            data: result.data
          });
          ref = result.included;
          for (i = 0, len = ref.length; i < len; i++) {
            record = ref[i];
            store.push({
              data: record
            });
          }
          return repo;
        });
        return promise['catch'](function () {
          var error = void 0;
          error = new Error('repo not found');
          error.slug = slug;
          throw error;
        });
      }
    }
  });

  exports.default = Repo;
});