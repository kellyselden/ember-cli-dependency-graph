define('code-corps-ember/models/task-list', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships'], function (exports, _model, _attr, _relationships) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var sort = Ember.computed.sort;
  exports.default = _model.default.extend({

    /**
      Indicates whether this is the inbox list to receive new tasks.
       @attribute inbox
      @type boolean
     */
    inbox: (0, _attr.default)(),

    /**
      Task-lists name
       @attribute name
      @type string
     */
    name: (0, _attr.default)(),

    /**
      Order is a read-only attribute computed from the `position` attribute
       @attribute order
      @readonly
      @type number
     */
    order: (0, _attr.default)(),

    /**
      Position is a virtual (write-only) attribute used to compute the `order` of the task-list
       @attribute position
      @virtual
      @type number
     */
    position: (0, _attr.default)(),

    /**
      The project that the task-list belongs to.
       @attribute project
      @type Ember.computed
     */
    project: (0, _relationships.belongsTo)('project', { async: true }),

    /**
      The tasks that belong to the task-list.
       @attribute tasks
      @type Ember.computed
     */
    tasks: (0, _relationships.hasMany)('task', { async: true }),
    sorting: ['order:asc'],
    orderedTasks: sort('tasks', 'sorting')
  });
});