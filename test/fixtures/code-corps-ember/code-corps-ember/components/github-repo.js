define('code-corps-ember/components/github-repo', ['exports', 'code-corps-ember/mixins/repo-sync-progress', 'ember-concurrency'], function (exports, _repoSyncProgress, _emberConcurrency) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed;
  var get = Ember.get;
  var getProperties = Ember.getProperties;
  var set = Ember.set;
  var notEmpty = Ember.computed.notEmpty;
  var Component = Ember.Component;
  exports.default = Component.extend(_repoSyncProgress.default, {
    classNames: ['github-repo'],
    classNameBindings: ['belongsToOtherProject:github-repo--belongs-to-other-project', 'belongsToProject:github-repo--belongs-to-project', 'isConnected:github-repo--connected', 'showingSettings:github-repo--expanded'],
    tagName: 'li',

    githubRepo: null,
    project: null,
    showSettings: false,

    belongsToOtherProject: computed('githubRepo.project.id', 'project.id', function () {
      var projectId = get(this, 'project.id');
      var connectedProjectId = get(this, 'githubRepo.project.id');
      return connectedProjectId && projectId !== connectedProjectId;
    }),
    belongsToProject: computed('githubRepo.project.id', 'project.id', function () {
      return get(this, 'githubRepo.project.id') === get(this, 'project.id');
    }),
    isConnected: notEmpty('githubRepo.project.id'),
    repoIcon: computed('isConnected', 'syncInProgress', function () {
      var isConnected = get(this, 'isConnected');
      var syncInProgress = get(this, 'syncInProgress');
      if (syncInProgress) {
        return 'github-repo-pull-48';
      } else if (isConnected) {
        return 'github-repo-clone-48';
      } else {
        return 'github-repo-48';
      }
    }),

    pollServerForChanges: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var syncing, syncComplete, errored, isConnected, githubRepo, repoIsLoading;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              syncing = get(this, 'syncing');
              syncComplete = get(this, 'syncComplete');
              errored = get(this, 'errored');
              isConnected = get(this, 'isConnected');

              if (isConnected) {
                _context.next = 6;
                break;
              }

              return _context.abrupt('return');

            case 6:
              if (!(syncing && !syncComplete && !errored)) {
                _context.next = 14;
                break;
              }

              _context.next = 9;
              return (0, _emberConcurrency.timeout)(2000);

            case 9:
              // wait 2 seconds

              githubRepo = get(this, 'githubRepo');
              repoIsLoading = get(githubRepo, 'isLoading');


              if (githubRepo && !repoIsLoading) {
                githubRepo.reload();
              }
              _context.next = 6;
              break;

            case 14:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    })).on('didRender').cancelOn('willDestroyElement').restartable(),

    click: function click() {
      var _getProperties = getProperties(this, 'belongsToProject', 'isConnected'),
          belongsToProject = _getProperties.belongsToProject,
          isConnected = _getProperties.isConnected;

      if (!isConnected || isConnected && belongsToProject) {
        this.toggleProperty('showSettings');
      }
    },


    actions: {
      connectRepo: function connectRepo(githubRepo, project) {
        // Send the action to connect
        this.sendAction('connectRepo', githubRepo, project);
      },
      disconnectRepo: function disconnectRepo(githubRepo) {
        // Send the action to disconnect
        this.sendAction('disconnectRepo', githubRepo);

        set(this, 'showSettings', false);
      }
    }
  });
});