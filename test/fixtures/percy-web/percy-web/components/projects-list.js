define('percy-web/components/projects-list', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    projects: null,

    classNames: ['ProjectsList'],
    classNameBindings: ['classes']
  });
});