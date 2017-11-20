define('code-corps-ember/components/project-menu', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var filterBy = Ember.computed.filterBy;
  var gt = Ember.computed.gt;
  var alias = Ember.computed.alias;
  var service = Ember.inject.service;
  exports.default = Component.extend({
    classNames: ['page-menu', 'page-menu--horizontal', 'project__menu'],
    tagName: 'nav',

    /**
      Service that provides user authentication information.
       @property session
      @type Ember.Service
     */
    session: service(),

    projectHasPendingUsers: gt('projectPendingUsersCount', 0),
    projectPendingUsersCount: alias('projectPendingUsers.length'),
    projectPendingUsers: filterBy('project.projectUsers', 'role', 'pending')
  });
});