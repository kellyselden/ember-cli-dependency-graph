define('code-corps-ember/abilities/task', ['exports', 'ember-can'], function (exports, _emberCan) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var or = Ember.computed.or;
  var equal = Ember.computed.equal;
  var alias = Ember.computed.alias;
  var get = Ember.get;
  var computed = Ember.computed;
  var service = Ember.inject.service;
  var isEmpty = Ember.isEmpty;
  exports.default = _emberCan.Ability.extend({
    currentUser: service(),

    task: alias('model'),

    userIsAuthor: computed('task.user.id', 'currentUser.user.id', function () {
      var taskUserId = this.get('task.user.id');
      var currentUserId = this.get('currentUser.user.id');

      if (isEmpty(currentUserId)) {
        return false;
      } else {
        return taskUserId === currentUserId;
      }
    }),

    // TODO: Similar code is defined in
    // - `components/project-header.js`
    // - `abilities/project.js`
    projectMembership: computed('task.project.projectUsers', 'currentUser.user.id', function () {
      var currentUserId = get(this, 'currentUser.user.id');

      if (isEmpty(currentUserId)) {
        return false;
      } else {
        return get(this, 'task.project.projectUsers').find(function (item) {
          return get(item, 'user.id') === currentUserId;
        });
      }
    }),

    userRole: alias('projectMembership.role'),
    userIsContributor: equal('userRole', 'contributor'),
    userIsAdmin: equal('userRole', 'admin'),
    userIsOwner: equal('userRole', 'owner'),

    //
    // Abilities
    //

    // task authors, admins and owners can edit
    canEdit: or('{userIsAuthor,userIsAdmin,userIsOwner}'),
    // task authors, contributors, admins and owners can assign and reposition
    canArchive: alias('canAssign'),
    canAssign: or('canEdit', 'userIsContributor'),
    canReposition: alias('canAssign')
  });
});