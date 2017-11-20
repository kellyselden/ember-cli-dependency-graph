define('percy-web/components/build-header', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var or = Ember.computed.or;
  var Component = Ember.Component;
  exports.default = Component.extend({
    build: null,
    classNames: ['BuildHeader'],

    showActions: or('build.isPending', 'build.isProcessing', 'build.isFinished')
  });
});