define('code-corps-ember/components/user-details', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var mapBy = Ember.computed.mapBy;
  exports.default = Component.extend({
    classNames: ['user-details'],

    userProjects: mapBy('user.projectUsers', 'project')
  });
});