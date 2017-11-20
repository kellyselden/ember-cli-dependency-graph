define('code-corps-ember/components/task-title', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var alias = Ember.computed.alias;
  var Component = Ember.Component;
  var service = Ember.inject.service;
  var set = Ember.set;
  var get = Ember.get;
  var computed = Ember.computed;
  exports.default = Component.extend({
    classNames: ['task-title'],
    classNameBindings: ['isEditing:editing'],

    /**
      @property currentUser
      @type Ember.Service
     */
    currentUser: service(),

    /**
      Returns whether or not the current user can edit the current task.
       @property canEdit
      @type Boolean
     */
    canEdit: alias('currentUserIsTaskAuthor'),

    /**
      Returns the current user's ID.
       @property currentUserId
      @type Number
     */
    currentUserId: alias('currentUser.user.id'),

    /**
      Returns the task author's ID.
       @property taskAuthorId
      @type Number
     */
    taskAuthorId: alias('task.user.id'),

    /**
      Consumes `currentUserId` and `taskAuthorId` and returns if the current user
      is the task author.
       @property currentUserIsTaskAuthor
      @type Boolean
     */
    currentUserIsTaskAuthor: computed('currentUserId', 'taskAuthorId', function () {
      var userId = parseInt(get(this, 'currentUserId'), 10);
      var authorId = parseInt(get(this, 'taskAuthorId'), 10);
      return userId === authorId;
    }),

    init: function init() {
      this._super.apply(this, arguments);
      this.setProperties({
        isEditing: false
      });
    },


    actions: {
      /**
        Action that sets the `isEditing` property to `false`
         @method cancel
       */
      cancel: function cancel() {
        set(this, 'isEditing', false);
      },


      /**
        Action that set the `isEditing` property to true and sets the `newTitle`
        property to the current title.
         @method edit
       */
      edit: function edit() {
        set(this, 'newTitle', get(this, 'task.title'));
        set(this, 'isEditing', true);
      },


      /**
        Action that sets the `title` property to the `newTitle` and calls save on
        the task. If the task successfully saves, the `isEditing` property is set
        to `false`.
         @method save
       */
      applyEdit: function applyEdit() {
        var component = this;
        var task = get(this, 'task');
        var newTitle = get(this, 'newTitle');

        set(task, 'title', newTitle);
        get(this, 'saveTask')(task).then(function () {
          set(component, 'isEditing', false);
        });
      }
    }
  });
});