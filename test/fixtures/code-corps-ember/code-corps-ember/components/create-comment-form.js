define('code-corps-ember/components/create-comment-form', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var service = Ember.inject.service;
  var set = Ember.set;
  var get = Ember.get;
  exports.default = Component.extend({
    classNames: ['create-comment-form'],
    tagName: 'form',

    /**
     * The injected services/session service. Used to determine if there is a
     * signed in user.
     *
     * @property session
     * @type Ember.Service
     */
    session: service(),

    /**
     * didReceiveAttrs - Component lifecycle hook
     *
     * We use it to set the initial value of the markdown edit field.
     */
    didReceiveAttrs: function didReceiveAttrs() {
      set(this, 'markdown', get(this, 'comment.markdown'));
    }
  });
});