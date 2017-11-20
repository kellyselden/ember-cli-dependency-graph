define('code-corps-ember/components/project-join-modal', ['exports', 'ember-keyboard'], function (exports, _emberKeyboard) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var alias = Ember.computed.alias;
  var service = Ember.inject.service;
  var on = Ember.on;
  var set = Ember.set;
  var get = Ember.get;
  exports.default = Component.extend(_emberKeyboard.EKMixin, {
    classNames: ['project-join-modal-container'],
    /**
     * Flag indicating if the modal to quickly join a project should be shown
     * Even if true, the modal will not be shown if there is a
     * currentProjectMembership
     *
     * @property showModal
     * @type {Boolean}
     */
    showModal: false,

    currentUser: service(),
    projectUser: service(),

    user: alias('currentUser.user'),

    init: function init() {
      this._super.apply(this, arguments);
      set(this, 'keyboardActivated', true);
    },


    closeOnEsc: on((0, _emberKeyboard.keyDown)('Escape'), function () {
      set(this, 'showModal', false);
    }),

    actions: {
      joinProject: function joinProject(project) {
        get(this, 'projectUser').joinProject(project);
      }
    }
  });
});