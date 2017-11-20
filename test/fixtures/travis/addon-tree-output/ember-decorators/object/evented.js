define('ember-decorators/object/evented', ['exports', 'ember-decorators/utils/decorator-macros'], function (exports, _decoratorMacros) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.on = undefined;


  /**
   * Decorator that wraps [Ember.on](https://emberjs.com/api/#method_on)
   *
   * Triggers the target function on events
   *
   * ```javascript
   * import Component from '@ember/component';
   * import { on } from 'ember-decorators/object/evented';
   *
   * export default class EventDemoComponent extends Component
   *   @on('init')
   *   setupStuff() {
   *     //...
   *   }
   * }
   * ```
   *
   * @function
   * @param {...String} eventNames - Names of the events that trigger the function
   */
  var on = exports.on = (0, _decoratorMacros.decoratorWithRequiredParams)(Ember.on);
});