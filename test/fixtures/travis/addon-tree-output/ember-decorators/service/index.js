define('ember-decorators/service/index', ['exports', 'ember-decorators/utils/decorator-macros'], function (exports, _decoratorMacros) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.service = undefined;


  /**
   * Decorator that wraps `Ember.inject.service`
   *
   * Injects a service into the object as the decorated property
   *
   *  ```javascript
   * import Component from '@ember/component';
   * import { service } from 'ember-decorators/service';
   *
   * export default class StoreInjectedComponent extends Component
   *   @service store;
   * }
   * ```
   *
   * @function
   * @param {String} [serviceName] - The name of the service to inject. If not provided, the property name will be used
   */
  var service = exports.service = (0, _decoratorMacros.decoratorWithKeyReflection)(Ember.inject.service);
});