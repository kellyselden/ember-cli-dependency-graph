define('travis/routes/first-sync', ['exports', 'travis/routes/simple-layout'], function (exports, _simpleLayout) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var later = Ember.run.later;
  exports.default = _simpleLayout.default.extend({
    activate: function activate() {
      var controller = void 0;
      controller = this.controllerFor('firstSync');
      return controller.addObserver('isSyncing', this, this.isSyncingDidChange);
    },
    deactivate: function deactivate() {
      var controller = void 0;
      controller = this.controllerFor('firstSync');
      return controller.removeObserver('controller.isSyncing', this, this.isSyncingDidChange);
    },
    isSyncingDidChange: function isSyncingDidChange() {
      var controller = void 0,
          self = void 0;
      controller = this.controllerFor('firstSync');
      if (!controller.get('isSyncing')) {
        return later(this, function () {
          var _this = this;

          return this.store.query('repo', {
            member: this.get('controller.user.login')
          }).then(function (repos) {
            if (repos.get('length')) {
              return _this.transitionTo('index');
            } else {
              return _this.transitionTo('profile');
            }
          }).then(function (e) {
            if (self.get('features.debugLogging')) {
              // eslint-disable-next-line
              return console.log('There was a problem while redirecting from first sync', e);
            }
          });
        }, this.get('config').syncingPageRedirectionTime);
      }
    },


    actions: {
      redirectToGettingStarted: function redirectToGettingStarted() {
        // do nothing, we are showing first sync, so it's normal that there is
        // no owned repos
      }
    }
  });
});