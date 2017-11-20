define('ember-decorators/controller/index', ['exports', 'ember-decorators/utils/decorator-macros'], function (exports, _decoratorMacros) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.controller = undefined;


  /**
   * Decorator that wraps `Ember.inject.controller`
   *
   * Injects a controller into a Controller as the decorated property
   *
   *  ```javascript
   * import Controller from '@ember/controller';
   * import { controller } from 'ember-decorators/controller';
   *
   * export default class IndexController extends Controller {
   *   @controller application;
   * }
   * ```
   *
   * @function
   * @param {String} [controllerName] - The name of the controller to inject. If not provided, the property name will be used
   */
  var controller = exports.controller = (0, _decoratorMacros.decoratorWithKeyReflection)(Ember.inject.controller);
});