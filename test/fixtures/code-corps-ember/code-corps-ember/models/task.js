define('code-corps-ember/models/task', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships', 'code-corps-ember/mixins/contains-code'], function (exports, _model, _attr, _relationships, _containsCode) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _model.default.extend(_containsCode.default, {
    archived: (0, _attr.default)(),
    body: (0, _attr.default)(),
    createdAt: (0, _attr.default)('date'),
    createdFrom: (0, _attr.default)(),
    markdown: (0, _attr.default)(),
    number: (0, _attr.default)('number'),
    order: (0, _attr.default)(),
    status: (0, _attr.default)(),
    title: (0, _attr.default)(),
    updatedAt: (0, _attr.default)('date'),

    /**
      Position is a virtual (write-only) attribute used to compute the `order` of the task by the server.
     */
    position: (0, _attr.default)(),

    /**
      The comments that belong to the task
       @attribute comments
      @type Ember.computed
     */
    comments: (0, _relationships.hasMany)('comment', { async: true }),

    /**
      The comment user mentions that belong to the task
       @attribute commentUserMentions
      @type Ember.computed
     */
    commentUserMentions: (0, _relationships.hasMany)('comment-user-mention', { async: true }),

    /**
     * The GitHub issue synced with this task
     *
     * @attribute githubIssue
     * @type DS.Model
     */
    githubIssue: (0, _relationships.belongsTo)('github-issue', { async: true }),

    /**
     * The GitHub pull request synced with this task
     *
     * @attribute githubPullRequest
     * @type DS.Model
     */
    githubPullRequest: (0, _relationships.belongsTo)('github-pull-request', { async: true }),

    /**
     * The github repository where an issue connected to this task exists
     *
     * @attribute githubRepo
     * @type DS.Model
     */
    githubRepo: (0, _relationships.belongsTo)('github-repo', { async: true }),

    /**
      The task-list that the task belongs to
       @attribute task-list
      @type Ember.computed
     */
    taskList: (0, _relationships.belongsTo)('task-list', { async: true }),

    taskSkills: (0, _relationships.hasMany)('task-skill', { async: true }),

    /**
      The task user mentions that belong to the task.
       @attribute taskUserMentions
      @type Ember.computed
     */
    taskUserMentions: (0, _relationships.hasMany)('task-user-mention', { asnyc: true }),

    /**
      The project that the task belongs to
       @attribute project
      @type Ember.computed
     */
    project: (0, _relationships.belongsTo)('project', { async: true }),

    /**
      The user that the task belongs to
       @attribute user
      @type Ember.computed
     */
    user: (0, _relationships.belongsTo)('user', { async: true }),

    /**
      The user task relationshipp
       @attribute userTask
      @type Ember.computed
     */
    userTask: (0, _relationships.belongsTo)('user-task', { async: true })
  });
});