define('code-corps-ember/utils/create-task-user-options', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = createTaskUserOptions;
  var get = Ember.get;
  var isEmpty = Ember.isEmpty;


  /**
   * Takes in a list of project users, the current user id and,
   * if it exists, the id of the user currently assigned to the taskUserId
   *
   * Out of these parameters, it builds groups of users to be displayed on
   * the task assignment dropdown.
   *
   * The groups are
   *
   * - current user
   * - currently assigned user
   * - other project users
   *
   * @param {DS.ManyArray}  users
   * @param {String}  currentUserId
   * @param {String}  taskUserId
   * @return {Array}
   */
  function createTaskUserOptions(users, currentUserId, taskUserId) {
    if (isEmpty(users)) {
      return [];
    }

    // Filter the current user
    var currentUserOptions = users.filter(function (user) {
      return get(user, 'id') === currentUserId;
    });

    // Filter the task user, unless they're also the current user
    var taskUserOptions = users.filter(function (user) {
      var userId = get(user, 'id');
      return userId !== currentUserId && userId === taskUserId;
    });

    // Filter the current user and task user from the remaining users
    var remainingUsersOptions = users.reject(function (user) {
      var userId = get(user, 'id');
      return userId === currentUserId || userId === taskUserId;
    }).sortBy('username');

    // 'groupName' is needed for ember power select to work
    var currentUserGroup = { groupName: 'Current User', options: currentUserOptions };
    var taskUserGroup = { groupName: 'Assigned User', options: taskUserOptions };
    var remainingUsersGroup = { groupName: 'Everyone Else', options: remainingUsersOptions };

    var groups = [];

    if (!isEmpty(currentUserOptions)) {
      groups.push(currentUserGroup);
    }

    if (!isEmpty(taskUserOptions)) {
      groups.push(taskUserGroup);
    }

    if (!isEmpty(remainingUsersOptions)) {
      groups.push(remainingUsersGroup);
    }

    return groups;
  }
});