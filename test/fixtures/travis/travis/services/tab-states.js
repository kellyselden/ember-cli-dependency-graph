define('travis/services/tab-states', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Service = Ember.Service;
  exports.default = Service.extend({
    sidebarTab: 'owned',
    mainTab: 'current'
  });
});