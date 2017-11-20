define('ghost-admin/instance-initializers/hide-loading-screen', ['exports', 'ghost-admin/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;


  var userConfig = _environment.default['ember-load'] || {};

  function initialize() {
    var instance = arguments[1] || arguments[0];
    var container = !!arguments[1] ? arguments[0] : instance.container;

    if (Ember.View) {
      var ApplicationView = container.lookupFactory ? container.lookupFactory('view:application') : instance.resolveRegistration('view:application');

      ApplicationView = ApplicationView.reopen({
        didInsertElement: function didInsertElement() {
          this._super.apply(this, arguments);

          var loadingIndicatorClass = userConfig.loadingIndicatorClass || 'ember-load-indicator';

          Ember.$('.' + loadingIndicatorClass).remove();
        }
      });
    }
  }

  exports.default = {
    name: 'hide-loading-screen-instance',
    initialize: initialize
  };
});