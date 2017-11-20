define('code-corps-ember/components/task-details', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var alias = Ember.computed.alias;
  var service = Ember.inject.service;
  var set = Ember.set;
  var get = Ember.get;
  var computed = Ember.computed;
  exports.default = Component.extend({
    classNames: ['task-details'],

    /**
      @property currentUser
      @type Ember.Service
     */
    currentUser: service(),

    /**
      A service that is used for fetching mentions within a body of text.
       @property mentionFetcher
      @type Ember.Service
     */
    mentionFetcher: service(),

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
      set(this, 'isEditingBody', false);
      this._prefetchMentions(get(this, 'task'));
      return this._super.apply(this, arguments);
    },


    actions: {

      /**
        Action that stops the editing of the corresponding task.
         @method cancelEditingTaskBody
       */
      cancelEditingTaskBody: function cancelEditingTaskBody() {
        set(this, 'isEditingBody', false);
      },


      /**
        Action that sets the corresponding task to edit mode.
         @method editTaskBody
       */
      editTaskBody: function editTaskBody() {
        set(this, 'isEditingBody', true);
      },


      /**
        Action that saves the corresponding task, turns off edit mode, and
        refetches the mentions.
         @method saveTaskBody
       */
      applyEditTask: function applyEditTask() {
        var _this = this;

        var task = get(this, 'task');

        get(this, 'saveTask')(task).then(function (task) {
          set(_this, 'isEditingBody', false);
          _this._fetchMentions(task);
        });
      }
    },

    /**
      Queries the store for body of text with mentions.
       @method _fetchMentions
      @param {Object} task
      @private
     */
    _fetchMentions: function _fetchMentions(task) {
      var _this2 = this;

      get(this, 'mentionFetcher').fetchBodyWithMentions(task, 'task').then(function (body) {
        if (body) {
          set(_this2, 'taskBodyWithMentions', body);
        }
      });
    },


    /**
      Parses the body of text and prefetches mentions.
       @method _prefetchMentions
      @param {Object} task
      @private
     */
    _prefetchMentions: function _prefetchMentions(task) {
      var body = get(this, 'mentionFetcher').prefetchBodyWithMentions(task, 'task');
      if (body) {
        set(this, 'taskBodyWithMentions', body);
      }
    }
  });
});