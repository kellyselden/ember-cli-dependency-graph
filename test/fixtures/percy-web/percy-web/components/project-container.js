define('percy-web/components/project-container', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    project: null,
    showQuickstart: false,
    classNames: ['ProjectContainer'],
    classNameBindings: ['classes'],
    actions: {
      refresh: function refresh() {
        var _this = this;

        this.set('isRefreshing', true);
        this.get('project').reload().then(function (project) {
          project.get('builds').reload().then(function () {
            _this.set('isRefreshing', false);
          });
        });
      },
      showSupport: function showSupport() {
        this.sendAction('showSupport');
      }
    }
  });
});