define('percy-web/components/build-overview', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    build: null,
    classes: null,

    classNames: ['BuildOverview'],
    classNameBindings: ['classes', 'build.isPending:BuildOverview--pending', 'build.isProcessing:BuildOverview--processing', 'build.isFinished:BuildOverview--finished', 'build.isFailed:BuildOverview--failed', 'build.isExpired:BuildOverview--expired', 'build.isApproved:BuildOverview--approved', 'build.hasDiffs:BuildOverview--hasDiffs']
  });
});