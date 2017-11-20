define('code-corps-ember/instance-initializers/head-tags', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize(instance) {
    var container = instance.lookup ? instance : instance.container;
    var service = container.lookup('service:head-tags');
    service.get('router').on('didTransition', function () {
      service.collectHeadTags();
    });
  }

  exports.default = {
    name: 'head-tags',
    initialize: initialize
  };
});