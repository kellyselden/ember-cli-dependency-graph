define('percy-web/components/projects/github-integrator', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var alias = Ember.computed.alias;
  var Component = Ember.Component;
  exports.default = Component.extend({
    project: null,
    classes: null,

    isSaving: null,
    isSaveSuccessful: null,

    organization: alias('project.organization'),

    triggerSavingIndicator: function triggerSavingIndicator(promise) {
      var _this = this;

      this.set('isSaveSuccessful', null);
      this.set('isSaving', true);
      promise.then(function () {
        _this.set('isSaving', false);
        _this.set('isSaveSuccessful', true);
      }, function () {
        _this.set('isSaveSuccessful', false);
      });
    },


    classNames: ['ProjectsGithubIntegrator'],
    classNameBindings: ['classes'],
    actions: {
      chooseRepo: function chooseRepo(repo) {
        var project = this.get('project');
        project.set('repo', repo);

        // If the project is not saved (ie. we're on the new project screen), don't trigger saving,
        // just set the property above and it will be saved when the user creates the project.
        if (!project.get('isNew')) {
          this.triggerSavingIndicator(project.save());
        }
      }
    }
  });
});