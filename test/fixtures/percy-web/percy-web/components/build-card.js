define('percy-web/components/build-card', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var getOwner = Ember.getOwner;
  var Component = Ember.Component;
  exports.default = Component.extend({
    build: null,
    classes: null,

    click: function click() {
      this.send('navigateToBuild');
    },

    classNames: ['BuildCard', 'container'],
    classNameBindings: ['classes', 'build.isExpired:BuildCard--expired'],
    actions: {
      navigateToBuild: function navigateToBuild() {
        // Send action directly up to application controller, so we don't have to delegate every
        // time in the template.
        var applicationController = getOwner(this).lookup('controller:application');
        applicationController.send('navigateToBuild', this.get('build'));
      }
    }
  });
});