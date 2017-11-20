define('travis/routes/application', ['exports', 'travis/routes/basic', 'travis/config/environment', 'travis/mixins/build-favicon', 'ember-keyboard-shortcuts/mixins/route'], function (exports, _basic, _environment, _buildFavicon, _route) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var $ = Ember.$;
  var service = Ember.inject.service;
  exports.default = _basic.default.extend(_buildFavicon.default, _route.default, {
    flashes: service(),
    auth: service(),
    featureFlags: service(),
    repositories: service(),

    needsAuth: false,

    renderTemplate: function renderTemplate() {
      if (this.get('config').pro) {
        $('body').addClass('pro');
      }
      return this._super.apply(this, arguments);
    },

    model: function model() {
      if (this.get('auth.signedIn')) {
        return this.get('featureFlags.fetchTask').perform();
      }
    },
    activate: function activate() {
      this.setupRepoSubscriptions();
    },


    // We send pusher updates through user channels now and this means that if a
    // user is not a collaborator of a repo or a user is not signed in, we need to
    // use repo channels for updates for each repo. This method ensures that a
    // visitor is subscribed to all of the public repos in the store as long as
    // they're not a collaborator. It also sets up an observer to subscribe to any
    // new repo that enters the store.
    setupRepoSubscriptions: function setupRepoSubscriptions() {
      var _this = this;

      this.get('store').filter('repo', null, function (repo) {
        return !repo.get('private') && !repo.get('isCurrentUserACollaborator');
      }, ['private', 'isCurrentUserACollaborator']).then(function (repos) {
        repos.forEach(function (repo) {
          return _this.subscribeToRepo(repo);
        });
        repos.addArrayObserver(_this, {
          willChange: 'reposWillChange',
          didChange: 'reposDidChange'
        });
      });
    },
    reposWillChange: function reposWillChange(array, start, removedCount, addedCount) {
      var _this2 = this;

      var removedRepos = array.slice(start, start + removedCount);
      return removedRepos.forEach(function (repo) {
        return _this2.unsubscribeFromRepo(repo);
      });
    },
    reposDidChange: function reposDidChange(array, start, removedCount, addedCount) {
      var _this3 = this;

      var addedRepos = array.slice(start, start + addedCount);
      return addedRepos.forEach(function (repo) {
        return _this3.subscribeToRepo(repo);
      });
    },


    unsubscribeFromRepo: function unsubscribeFromRepo(repo) {
      if (this.pusher) {
        this.pusher.unsubscribe('repo-' + repo.get('id'));
      }
    },

    subscribeToRepo: function subscribeToRepo(repo) {
      if (this.pusher) {
        this.pusher.subscribe('repo-' + repo.get('id'));
      }
    },

    title: function title(titleParts) {
      if (titleParts.length) {
        titleParts = titleParts.reverse();
        titleParts.push('Travis CI');
        return titleParts.join(' - ');
      } else {
        return _environment.default.defaultTitle;
      }
    },


    keyboardShortcuts: {
      'up': {
        action: 'disableTailing',
        preventDefault: false
      },
      'down': {
        action: 'disableTailing',
        preventDefault: false
      }
    },

    actions: {
      signIn: function signIn() {
        this.get('auth').signIn();
        this.afterSignIn();
      },
      signOut: function signOut() {
        this.get('featureFlags').reset();
        this.get('auth').signOut();
        this.afterSignOut();
      },
      disableTailing: function disableTailing() {
        Travis.tailing.stop();
      },
      redirectToGettingStarted: function redirectToGettingStarted() {
        // keep as a no-op as this bubbles from other routes
      },
      error: function error(_error) {
        if (_error === 'needs-auth') {
          this.set('auth.redirected', true);
          return this.transitionTo('auth');
        } else {
          return true;
        }
      },
      showRepositories: function showRepositories() {
        this.transitionTo('index');
      },
      viewSearchResults: function viewSearchResults(query) {
        this.transitionTo('search', query);
      },
      helpscoutTrigger: function helpscoutTrigger() {
        HS.beacon.open();
        return false;
      }
    },

    afterSignIn: function afterSignIn() {
      this.get('flashes').clear();
      var transition = this.auth.get('afterSignInTransition');
      if (transition) {
        this.auth.set('afterSignInTransition', null);
        return transition.retry();
      } else {
        return this.transitionTo('index');
      }
    },
    afterSignOut: function afterSignOut() {
      this.set('repositories.accessible', []);
      this.setDefault();
      if (this.get('config.enterprise')) {
        return this.transitionTo('auth');
      }
      return this.transitionTo('index');
    }
  });
});