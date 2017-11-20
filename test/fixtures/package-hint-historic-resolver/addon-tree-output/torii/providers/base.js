define('torii/providers/base', ['exports', 'torii/lib/required-property', 'torii/lib/container-utils', 'torii/configuration'], function (exports, _requiredProperty, _containerUtils, _configuration) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var DEFAULT_REMOTE_SERVICE_NAME = 'popup';

  var computed = Ember.computed;

  /**
   * The base class for all torii providers
   * @class BaseProvider
   */
  var Base = Ember.Object.extend({

    /**
     * The name of the provider
     * @property {string} name
     */
    name: (0, _requiredProperty.default)(),

    /**
     * The name of the configuration property
     * that holds config information for this provider.
     * @property {string} configNamespace
     */
    configNamespace: computed('name', function () {
      return 'providers.' + this.get('name');
    }),

    popup: computed('configuredRemoteServiceName', function () {
      var owner = (0, _containerUtils.getOwner)(this);
      var remoteServiceName = this.get('configuredRemoteServiceName') || _configuration.default.remoteServiceName || DEFAULT_REMOTE_SERVICE_NAME;
      return owner.lookup('torii-service:' + remoteServiceName);
    }),

    configuredRemoteServiceName: (0, _configuration.configurable)('remoteServiceName', null)
  });

  exports.default = Base;
});