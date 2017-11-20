define('percy-web/components/sync-repos-section', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var service = Ember.inject.service;
  var Component = Ember.Component;
  exports.default = Component.extend({
    organization: null,
    classes: null,

    isPrivateReposExpanded: false,
    session: service(),

    classNames: ['SyncReposSection', 'Card'],
    classNameBindings: ['classes', 'isPrivateReposExpanded::SyncReposSection--collapsed'],
    actions: {
      togglePrivateRepos: function togglePrivateRepos() {
        this.toggleProperty('isPrivateReposExpanded');
      }
    }
  });
});