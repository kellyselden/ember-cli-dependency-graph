define('package-hint-historic-resolver/controllers/application', ['exports', 'ember-macro-helpers/computed', 'ember-awesome-macros', 'ember-concurrency', 'package-hint-historic-resolver/config/environment', 'package-hint-historic-resolver/utils/get-repo'], function (exports, _computed, _emberAwesomeMacros, _emberConcurrency, _environment, _getRepo) {
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

  var Controller = Ember.Controller;
  var service = Ember.inject.service;
  var setProperties = Ember.setProperties;
  var set = Ember.set;
  var get = Ember.get;
  var repository = _environment.default.APP.repository;
  exports.default = Controller.extend({
    session: service(),
    task: service(),

    repository: repository,

    queryParams: {
      repoUrl: 'repoUrl',
      repoWorkingDateSerialized: 'repoWorkingDate',
      repoBrokenDateSerialized: 'repoBrokenDate',
      shouldOnlyShowDifferent: 'shouldOnlyShowDifferent'
    },

    shouldOnlyShowDifferent: false,

    firstJson: {},
    secondJson: {},

    repoWorkingDate: (0, _computed.default)('repoWorkingDateSerialized', deserializeDate),
    repoBrokenDate: (0, _computed.default)('repoBrokenDateSerialized', deserializeDate),

    repo: (0, _computed.default)('repoUrl', _getRepo.default),

    areDatesOutOfOrder: (0, _emberAwesomeMacros.gt)('repoWorkingDate', 'repoBrokenDate'),

    rebuild: function rebuild() {
      this._rebuildWorking();
      this._rebuildBroken();
    },
    _rebuildWorking: function _rebuildWorking() {
      var rebuild = get(this, '_rebuild');
      rebuild.perform('repoWorkingDate', 'firstCommit', 'firstCommitError', 'firstCommitDate', 'repoWorkingDateError', 'firstJson');
    },
    _rebuildBroken: function _rebuildBroken() {
      var rebuild = get(this, '_rebuild');
      rebuild.perform('repoBrokenDate', 'secondCommit', 'secondCommitError', 'secondCommitDate', 'repoBrokenDateError', 'secondJson');
    },

    _rebuild: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee(repoDateProp, commitProp, commitErrorProp, commitDateProp, packageErrorProp, jsonProp) {
      var repo, areDatesOutOfOrder, task, repoDate, properties, getCommit, response, _response, responseHeaders, responseBody, _responseBody, latestCommit, sha, commit, getPackage, data;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              repo = get(this, 'repo');

              if (repo) {
                _context.next = 3;
                break;
              }

              return _context.abrupt('return');

            case 3:
              areDatesOutOfOrder = get(this, 'areDatesOutOfOrder');

              if (!areDatesOutOfOrder) {
                _context.next = 6;
                break;
              }

              return _context.abrupt('return');

            case 6:
              task = get(this, 'task');
              repoDate = get(this, repoDateProp);
              properties = {};

              properties[commitErrorProp] = undefined;
              properties[packageErrorProp] = undefined;
              setProperties(this, properties);

              getCommit = get(task, 'getCommit');
              response = void 0;
              _context.prev = 14;
              _context.next = 17;
              return getCommit.perform(repo, repoDate);

            case 17:
              response = _context.sent;
              _context.next = 24;
              break;

            case 20:
              _context.prev = 20;
              _context.t0 = _context['catch'](14);

              set(this, commitErrorProp, _context.t0);

              return _context.abrupt('return');

            case 24:
              _response = response, responseHeaders = _response.responseHeaders, responseBody = _response.responseBody;
              _responseBody = _slicedToArray(responseBody, 1), latestCommit = _responseBody[0];
              sha = latestCommit.sha, commit = latestCommit.commit;


              properties = {};
              properties['githubRateLimit'] = responseHeaders['X-RateLimit-Limit'];
              properties['githubRateRemaining'] = responseHeaders['X-RateLimit-Remaining'];
              properties['githubRateReset'] = parseInt(responseHeaders['X-RateLimit-Reset']) * 1000;
              properties[commitProp] = sha;
              properties[commitDateProp] = commit.author.date;
              setProperties(this, properties);

              getPackage = get(task, 'getPackage');
              data = void 0;
              _context.prev = 36;
              _context.next = 39;
              return getPackage.perform(repo, sha);

            case 39:
              data = _context.sent;
              _context.next = 46;
              break;

            case 42:
              _context.prev = 42;
              _context.t1 = _context['catch'](36);

              set(this, packageErrorProp, _context.t1);

              return _context.abrupt('return');

            case 46:

              set(this, jsonProp, data);

            case 47:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[14, 20], [36, 42]]);
    })),

    actions: {
      logIn: function logIn() {
        get(this, 'session').authenticate('authenticator:torii', 'github');
      },
      logOut: function logOut() {
        get(this, 'session').invalidate();
      },
      updateRepoUrl: function updateRepoUrl(url) {
        var oldUrl = get(this, 'repoUrl');
        if (url !== oldUrl) {
          set(this, 'repoUrl', url || undefined);

          this.rebuild();
        }
      },
      updateRepoWorkingDate: function updateRepoWorkingDate(date) {
        var oldDate = get(this, 'repoWorkingDateSerialized');
        if (date !== oldDate) {
          set(this, 'repoWorkingDateSerialized', serializeDate(date));

          this._rebuildWorking();
        }
      },
      updateRepoBrokenDate: function updateRepoBrokenDate(date) {
        var oldDate = get(this, 'repoBrokenDateSerialized');
        if (date !== oldDate) {
          set(this, 'repoBrokenDateSerialized', serializeDate(date));

          this._rebuildBroken();
        }
      }
    }
  });


  function deserializeDate(string) {
    return string ? new Date(string) : new Date();
  }
  function serializeDate(date) {
    if (date) {
      return date.toISOString();
    }
  }
});