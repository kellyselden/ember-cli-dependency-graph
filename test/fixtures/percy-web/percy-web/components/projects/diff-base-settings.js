define('percy-web/components/projects/diff-base-settings', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    project: null,
    classes: null,

    isSaving: null,
    isSaveSuccessful: null,
    classNames: ['ProjectsDiffBaseSettings'],
    classNameBindings: ['classes'],
    saveProject: function saveProject() {
      var _this = this;

      this.set('isSaving', true);
      this.set('isSaveSuccessful', null);
      this.get('project').save().then(function () {
        _this.set('isSaving', false);
        _this.set('isSaveSuccessful', true);
      }, function () {
        _this.set('isSaving', false);
        _this.set('isSaveSuccessful', false);
      });
    },

    actions: {
      setAutomatic: function setAutomatic() {
        this.set('project.diffBase', 'automatic');
        this.saveProject();
      },
      setManual: function setManual() {
        this.set('project.diffBase', 'manual');
        this.saveProject();
      }
    }
  });
});