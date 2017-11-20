define('code-corps-ember/components/comment-item', ['exports', 'code-corps-ember/utils/mention-parser'], function (exports, _mentionParser) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var service = Ember.inject.service;
  var isEqual = Ember.isEqual;
  var set = Ember.set;
  var get = Ember.get;
  var computed = Ember.computed;
  exports.default = Component.extend({
    classNames: ['comment-item', 'timeline-comment-wrapper'],
    classNameBindings: ['isEditing:editing'],

    /**
     * canEdit - Computed property
     *
     * @property canEdit
     * @return {Boolean}  True if current user is the comment author
     */
    canEdit: computed('currentUser.user.id', 'comment.user.id', function () {
      var userId = parseInt(get(this, 'currentUser.user.id'), 10);
      var authorId = parseInt(get(this, 'comment.user.id'), 10);

      return isEqual(userId, authorId);
    }),

    /**
     * Injection of /services/current-user
     *
     * Used to determine if the current user is the comment author,
     * for edit permissions.
     *
     * @property session
     * @type Ember.Service
     */
    currentUser: service(),

    /**
     * parsedBody - Computed property
     *
     * Parses the provided body and "linkifies" the username mentions within it
     * using information provided in the mentions collection
     *
     * We are expected to assign mentions in the template
     *
     * The component can load before the comment body has loaded.
     * Computing isLoaded allows us to parse the body once the data is available.
     *
     * NOTE: This feature is currently disabled, so the unmodified body is returned
     *
     * @property processedComment
     @ @type String
     */
    parsedBody: computed('comment.body', 'comment.isLoaded', 'mentions', function () {
      var body = get(this, 'comment.body');
      var mentions = get(this, 'mentions');
      return (0, _mentionParser.parse)(body, mentions || []);
    }),

    /**
     * nullbody - Computed property
     *
     * checks to see if outcome of processed content is null, indicating null
     * comment body and returns computed property as true if body is null.
     *
     * It tests specifically against null because parsedBody generates other
     * falsey outputs even when comment body is not null. For example, if the
     * comment data is not loaded yet, parsedBody returns undefined.
     */
    nullBody: computed('parsedBody', function () {
      if (get(this, 'parsedBody') === null) {
        return true;
      }
      return false;
    }),

    /**
     * didReceiveAttrs - Component lifecycle hook
     *
     * Used to initially set the component into view mode.
     */
    didReceiveAttrs: function didReceiveAttrs() {
      set(this, 'isEditing', false);
    },


    actions: {
      /**
       * cancel - Action
       *
       * Triggered when user clicks the cancel button in edit mode.
       * Rolls back comment record and enters view mode.
       */
      cancel: function cancel() {
        var comment = get(this, 'comment');
        comment.rollbackAttributes();
        set(this, 'isEditing', false);
      },


      /**
       * edit - Action
       *
       * Triggered when the user clicks the edit link in view mode.
       * Enters edit mode.
       */
      edit: function edit() {
        set(this, 'isEditing', true);
      },


      /**
       * save - Action
       *
       * Triggered when user clicks the save button in edit mode.
       * Save changes to comment.
       * On success, enters view mode.
       * On failure, sends `saveError` action with the failure payload.
       */
      save: function save() {
        var _this = this;

        var comment = get(this, 'comment');
        comment.save().then(function () {
          return set(_this, 'isEditing', false);
        }).catch(function (payload) {
          return _this.sendAction('saveError', payload);
        });
      }
    }
  });
});