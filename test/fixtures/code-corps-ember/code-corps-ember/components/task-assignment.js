define('code-corps-ember/components/task-assignment', ['exports', 'ember-can', 'code-corps-ember/utils/create-task-user-options', 'ember-keyboard'], function (exports, _emberCan, _createTaskUserOptions, _emberKeyboard) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var computed = Ember.computed;
  var get = Ember.get;
  var getProperties = Ember.getProperties;
  var set = Ember.set;
  var alias = Ember.computed.alias;
  var on = Ember.on;
  var run = Ember.run;
  var service = Ember.inject.service;
  var isEqual = Ember.isEqual;


  var TRIGGER_CLASS = '.ember-power-select-trigger';

  exports.default = Component.extend(_emberKeyboard.EKMixin, {
    classNames: ['task-assignment'],

    currentUser: service(),
    store: service(),
    taskAssignment: service(),

    isAssigning: false,
    canTriggerAssignment: null,
    deferredRendering: null,
    task: null,
    taskUser: null,
    users: null,

    // auto-assigns 'task' property from component as ability 'model'
    ability: _emberCan.default.computed.ability('task'),
    canAssign: alias('ability.canAssign'),
    currentUserId: alias('currentUser.user.id'),
    taskUserId: alias('taskUser.id'),

    assignedToSelf: computed('currentUserId', 'taskUser.id', function () {
      return isEqual(get(this, 'taskUser.id'), get(this, 'currentUserId'));
    }),

    init: function init() {
      this._super.apply(this, arguments);

      set(this, 'keyboardActivated', true);
    },


    // TODO: this updates selection when it changes. However, it updates while
    // the change is still processing, and rolls back if it fails.
    // We should somehow skip the update if the change is processing
    // TODO: It also fails to roll back when reassignment fails
    didReceiveAttrs: function didReceiveAttrs() {
      var _getProperties = getProperties(this, 'taskUserId', 'users'),
          taskUserId = _getProperties.taskUserId,
          users = _getProperties.users;

      if (users) {
        set(this, 'selectedOption', users.findBy('id', taskUserId));
      }
    },


    /**
      Computed property, builds and maintains the list used to render the
      dropdown options on task assignment
       @property userOptions
    */
    userOptions: computed('currentUserId', 'taskUserId', 'users', function () {
      var _getProperties2 = getProperties(this, 'currentUserId', 'taskUserId', 'users'),
          currentUserId = _getProperties2.currentUserId,
          taskUserId = _getProperties2.taskUserId,
          users = _getProperties2.users;

      return users ? (0, _createTaskUserOptions.default)(users, currentUserId, taskUserId) : [];
    }),

    changeUser: function changeUser(user) {
      var _getProperties3 = getProperties(this, 'task', 'taskAssignment'),
          task = _getProperties3.task,
          taskAssignment = _getProperties3.taskAssignment;

      return user ? taskAssignment.assign(task, user) : taskAssignment.unassign(task);
    },
    clickTrigger: function clickTrigger() {
      this.$('.ember-basic-dropdown-trigger').get(0).dispatchEvent(new MouseEvent('mousedown'));
    },


    selfAssign: on((0, _emberKeyboard.keyDown)('Space'), function (e) {
      var _getProperties4 = getProperties(this, 'canAssign', 'canTriggerAssignment', 'isAssigning'),
          canAssign = _getProperties4.canAssign,
          canTriggerAssignment = _getProperties4.canTriggerAssignment,
          isAssigning = _getProperties4.isAssigning;

      if (canAssign && !isAssigning && canTriggerAssignment) {
        e.preventDefault();
        this.toggleSelfAssignment();
      }
    }),

    toggleSelfAssignment: function toggleSelfAssignment() {
      if (get(this, 'assignedToSelf')) {
        this.changeUser(); // unassign
      } else {
        var user = get(this, 'currentUser.user');
        this.changeUser(user); // self-assign
      }
    },


    triggerAssignment: on((0, _emberKeyboard.keyDown)('KeyA'), function (e) {
      var _this = this;

      var _getProperties5 = getProperties(this, 'canAssign', 'canTriggerAssignment', 'isAssigning'),
          canAssign = _getProperties5.canAssign,
          canTriggerAssignment = _getProperties5.canTriggerAssignment,
          isAssigning = _getProperties5.isAssigning;

      if (canAssign && !isAssigning && canTriggerAssignment) {
        e.preventDefault();
        run(function () {
          return _this.clickTrigger();
        });
      }
    }),

    actions: {
      buildSelection: function buildSelection(option, select) {
        return option === select.selected ? null : option;
      },
      changeUser: function changeUser(user) {
        this.changeUser(user);
      },
      closeDropdown: function closeDropdown() {
        var _this2 = this;

        set(this, 'isAssigning', false);
        this.sendAction('onclose');
        run.next(function () {
          return _this2.$(TRIGGER_CLASS).trigger('blur');
        });
      },
      openDropdown: function openDropdown() {
        set(this, 'isAssigning', true);
        this.sendAction('onopen');
      },
      searchUsers: function searchUsers(query) {
        var _getProperties6 = getProperties(this, 'currentUserId', 'store', 'taskUserId'),
            currentUserId = _getProperties6.currentUserId,
            store = _getProperties6.store,
            taskUserId = _getProperties6.taskUserId;

        return store.query('user', { query: query }).then(function (users) {
          return (0, _createTaskUserOptions.default)(users.toArray(), currentUserId, taskUserId);
        });
      },
      stopClickPropagation: function stopClickPropagation(e) {
        e.stopPropagation();
      }
    }
  });
});