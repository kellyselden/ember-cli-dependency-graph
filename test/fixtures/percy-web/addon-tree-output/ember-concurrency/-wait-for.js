define('ember-concurrency/-wait-for', ['exports', 'ember-concurrency/utils'], function (exports, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.waitForQueue = waitForQueue;
  exports.waitForEvent = waitForEvent;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var schedule = Ember.run.schedule;

  var WaitForQueueYieldable = function () {
    function WaitForQueueYieldable(queueName) {
      _classCallCheck(this, WaitForQueueYieldable);

      this.queueName = queueName;
    }

    _createClass(WaitForQueueYieldable, [{
      key: _utils.yieldableSymbol,
      value: function value(taskInstance, resumeIndex) {
        schedule(this.queueName, function () {
          taskInstance.proceed(resumeIndex, _utils.YIELDABLE_CONTINUE, null);
        });
      }
    }]);

    return WaitForQueueYieldable;
  }();

  var WaitForEventYieldable = function () {
    function WaitForEventYieldable(object, eventName) {
      _classCallCheck(this, WaitForEventYieldable);

      this.object = object;
      this.eventName = eventName;
    }

    _createClass(WaitForEventYieldable, [{
      key: _utils.yieldableSymbol,
      value: function value(taskInstance, resumeIndex) {
        var _this = this;

        var fn = function fn(event) {
          taskInstance.proceed(resumeIndex, _utils.YIELDABLE_CONTINUE, event);
        };
        this.object.one(this.eventName, fn);
        return function () {
          _this.object.off(_this.eventName, fn);
        };
      }
    }]);

    return WaitForEventYieldable;
  }();

  /**
   * Use `waitForQueue` to pause the task until a certain run loop queue is reached.
   *
   * ```js
   * import { task, timeout, waitForQueue } from 'ember-concurrency';
   * export default Component.extend({
   *   myTask: task(function * () {
   *     yield waitForQueue('afterRender');
   *     console.log("now we're in the afterRender queue");
   *   })
   * });
   * ```
   *
   * @param {string} queueName the name of the Ember run loop queue
   */
  function waitForQueue(queueName) {
    return new WaitForQueueYieldable(queueName);
  }

  /**
   * Use `waitForEvent` to pause the task until an event is fired. The event
   * can either be a jQuery event or an Ember.Evented event (or any event system
   * where the object supports `.on()` `.one()` and `.off()`).
   *
   * ```js
   * import { task, timeout, waitForEvent } from 'ember-concurrency';
   * export default Component.extend({
   *   myTask: task(function * () {
   *     console.log("Please click anywhere..");
   *     let clickEvent = yield waitForEvent($('body'), 'click');
   *     console.log("Got event", clickEvent);
   *
   *     let emberEvent = yield waitForEvent(this, 'foo');
   *     console.log("Got foo event", emberEvent);
   *
   *     // somewhere else: component.trigger('foo', { value: 123 });
   *   })
   * });
   * ```
   *
   * @param {object} object the Ember Object or jQuery selector (with ,on(), .one(), and .off())
   *                 that the event fires from
   * @param {function} eventName the name of the event to wait for
   */
  function waitForEvent(object, eventName) {
    (true && !((0, _utils.isEventedObject)(object)) && Ember.assert(object + ' must include Ember.Evented (or support `.on()`, `.one()`, and `.off()`) to be able to use `waitForEvent`', (0, _utils.isEventedObject)(object)));

    return new WaitForEventYieldable(object, eventName);
  }
});