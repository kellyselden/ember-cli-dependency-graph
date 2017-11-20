define('percy-web/components/build-state-badge', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    build: null,
    classes: null,

    classNames: ['BuildStateBadge'],
    classNameBindings: ['classes', 'build.isPending:BuildStateBadge--pending', 'build.isProcessing:BuildStateBadge--processing', 'build.isFinished:BuildStateBadge--finished', 'build.isFailed:BuildStateBadge--failed', 'build.isExpired:BuildStateBadge--expired', 'build.isApproved:BuildStateBadge--approved', 'build.hasDiffs:BuildStateBadge--hasDiffs']
  });
});