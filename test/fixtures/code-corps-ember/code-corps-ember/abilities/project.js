define('code-corps-ember/abilities/project', ['exports', 'ember-can'], function (exports, _emberCan) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var equal = Ember.computed.equal;
  var alias = Ember.computed.alias;
  var get = Ember.get;
  var computed = Ember.computed;
  var service = Ember.inject.service;
  var isEmpty = Ember.isEmpty;
  exports.default = _emberCan.Ability.extend({
    currentUser: service(),

    /**
     * An `ember-can` ability.
     *
     * Indicates if the current user can manage a project.
     * Returns true if the user is the owner of the project.
     * @type {Boolean}
     */
    canManage: alias('userIsOwner'),

    // TODO: Similar code is defined in
    // - `components/project-header.js`
    // - `abilities/task.js`
    projectMembership: computed('project.projectUsers', 'currentUser.user.id', function () {
      var currentUserId = get(this, 'currentUser.user.id');

      if (isEmpty(currentUserId)) {
        return false;
      } else {
        return get(this, 'project.projectUsers').find(function (item) {
          return get(item, 'user.id') === currentUserId;
        });
      }
    }),

    userRole: alias('projectMembership.role'),
    userIsOwner: equal('userRole', 'owner'),

    project: alias('model')
  });
});