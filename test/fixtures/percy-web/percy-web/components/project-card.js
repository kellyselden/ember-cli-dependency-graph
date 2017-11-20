define('percy-web/components/project-card', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    project: null,

    classNames: ['ProjectCard'],
    classNameBindings: ['classes', 'project.isDisabled:ProjectCard--disabled']
  });
});