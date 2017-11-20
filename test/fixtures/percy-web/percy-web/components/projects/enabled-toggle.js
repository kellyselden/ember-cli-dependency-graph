define('percy-web/components/projects/enabled-toggle', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    project: null,
    classes: null,

    classNames: ['ProjectsEnabledToggle'],
    classNameBindings: ['classes'],
    actions: {
      enable: function enable() {
        var project = this.get('project');
        project.set('isEnabled', true);
        project.save();
      },
      disable: function disable() {
        var project = this.get('project');
        project.set('isEnabled', false);
        project.save();
      }
    }
  });
});