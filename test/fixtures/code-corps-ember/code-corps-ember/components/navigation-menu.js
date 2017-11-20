define('code-corps-ember/components/navigation-menu', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var service = Ember.inject.service;
  exports.default = Component.extend({
    tagName: 'header',
    classNames: ['site-header'],

    /**
      @property currentUser
      @type Ember.Service
     */
    currentUser: service(),

    /**
      @property navigationMenu
      @type Ember.Service
     */
    navigationMenu: service(),

    /**
      @property onboarding
      @type Ember.Service
     */
    onboarding: service(),

    /**
      @property session
      @type Ember.Service
     */
    session: service()
  });
});