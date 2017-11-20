define('percy-web/components/build-state', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    build: null,
    classes: null,

    classNames: ['BuildState'],
    classNameBindings: ['classes', 'build.isPending:BuildState--pending', 'build.isProcessing:BuildState--processing', 'build.isFinished:BuildState--finished', 'build.isFailed:BuildState--failed', 'build.isExpired:BuildState--expired', 'build.isApproved:BuildState--approved', 'build.hasDiffs:BuildState--hasDiffs']
  });
});