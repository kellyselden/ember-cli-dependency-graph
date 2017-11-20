define('ember-concurrency/index', ['exports', 'ember-concurrency/utils', 'ember-concurrency/-task-property', 'ember-concurrency/-task-instance', 'ember-concurrency/-task-group', 'ember-concurrency/-evented-observable', 'ember-concurrency/-cancelable-promise-helpers', 'ember-concurrency/-wait-for'], function (exports, _utils, _taskProperty, _taskInstance, _taskGroup, _eventedObservable, _cancelablePromiseHelpers, _waitFor) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.waitForEvent = exports.waitForQueue = exports.timeout = exports.didCancel = exports.race = exports.hash = exports.allSettled = exports.all = undefined;
  exports.task = task;
  exports.taskGroup = taskGroup;
  exports.events = events;


  /**
   * A Task is a cancelable, restartable, asynchronous operation that
   * is driven by a generator function. Tasks are automatically canceled
   * when the object they live on is destroyed (e.g. a Component
   * is unrendered).
   *
   * To define a task, use the `task(...)` function, and pass in
   * a generator function, which will be invoked when the task
   * is performed. The reason generator functions are used is
   * that they (like the proposed ES7 async-await syntax) can
   * be used to elegantly express asynchronous, cancelable
   * operations.
   *
   * The following Component defines a task called `myTask` that,
   * when performed, prints a message to the console, sleeps for 1 second,
   * prints a final message to the console, and then completes.
   *
   * ```js
   * import { task, timeout } from 'ember-concurrency';
   * export default Component.extend({
   *   myTask: task(function * () {
   *     console.log("Pausing for a second...");
   *     yield timeout(1000);
   *     console.log("Done!");
   *   })
   * });
   * ```
   *
   * ```hbs
   * <button {{action myTask.perform}}>Perform Task</button>
   * ```
   *
   * By default, tasks have no concurrency constraints
   * (multiple instances of a task can be running at the same time)
   * but much of a power of tasks lies in proper usage of Task Modifiers
   * that you can apply to a task.
   *
   * @param {function} generatorFunction the generator function backing the task.
   * @returns {TaskProperty}
   */
  function task() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new (Function.prototype.bind.apply(_taskProperty.TaskProperty, [null].concat(args)))();
  }

  function taskGroup() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return new (Function.prototype.bind.apply(_taskGroup.TaskGroupProperty, [null].concat(args)))();
  }

  function events(obj, eventName) {
    return _eventedObservable.default.create({ obj: obj, eventName: eventName });
  }

  exports.all = _cancelablePromiseHelpers.all;
  exports.allSettled = _cancelablePromiseHelpers.allSettled;
  exports.hash = _cancelablePromiseHelpers.hash;
  exports.race = _cancelablePromiseHelpers.race;
  exports.didCancel = _taskInstance.didCancel;
  exports.timeout = _utils.timeout;
  exports.waitForQueue = _waitFor.waitForQueue;
  exports.waitForEvent = _waitFor.waitForEvent;
});