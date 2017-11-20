define('ghost-admin/components/gh-task-button', ['exports', 'ember-invoke-action', 'ember-concurrency'], function (exports, _emberInvokeAction, _emberConcurrency) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var computed = Ember.computed;
    var isBlank = Ember.isBlank;
    var observer = Ember.observer;
    var reads = Ember.computed.reads;


    /**
     * Task Button works exactly like Spin button, but with one major difference:
     *
     * Instead of passing a "submitting" parameter (which is bound to the parent object),
     * you pass an ember-concurrency task. All of the "submitting" behavior is handled automatically.
     *
     * As another bonus, there's no need to handle canceling the promises when something
     * like a controller changes. Because the only task running is handled through this
     * component, all running promises will automatically be cancelled when this
     * component is removed from the DOM
     */
    var GhTaskButton = Component.extend({
        tagName: 'button',
        classNameBindings: ['isRunning:appear-disabled', 'isIdleClass', 'isRunningClass', 'isSuccessClass', 'isFailureClass'],
        attributeBindings: ['disabled', 'type', 'tabindex'],

        task: null,
        disabled: false,
        buttonText: 'Save',
        runningText: reads('buttonText'),
        idleClass: '',
        runningClass: '',
        successText: 'Saved',
        successClass: 'gh-btn-green',
        failureText: 'Retry',
        failureClass: 'gh-btn-red',

        // hasRun is needed so that a newly rendered button does not show the last
        // state of the associated task
        hasRun: false,
        isRunning: reads('task.last.isRunning'),

        isIdleClass: computed('isIdle', function () {
            if (this.get('isIdle')) {
                return this.get('idleClass');
            }
        }),

        isRunningClass: computed('isRunning', function () {
            if (this.get('isRunning')) {
                return this.get('runningClass') || this.get('idleClass');
            }
        }),

        isSuccess: computed('hasRun', 'isRunning', 'task.last.value', function () {
            if (!this.get('hasRun') || this.get('isRunning')) {
                return false;
            }

            var value = this.get('task.last.value');
            return !isBlank(value) && value !== false;
        }),

        isSuccessClass: computed('isSuccess', function () {
            if (this.get('isSuccess')) {
                return this.get('successClass');
            }
        }),

        isFailure: computed('hasRun', 'isRunning', 'isSuccess', 'task.last.error', function () {
            if (!this.get('hasRun') || this.get('isRunning') || this.get('isSuccess')) {
                return false;
            }

            return this.get('task.last.error') !== undefined;
        }),

        isFailureClass: computed('isFailure', function () {
            if (this.get('isFailure')) {
                return this.get('failureClass');
            }
        }),

        isIdle: computed('isRunning', 'isSuccess', 'isFailure', function () {
            return !this.get('isRunning') && !this.get('isSuccess') && !this.get('isFailure');
        }),

        click: function click() {
            // do nothing if disabled externally
            if (this.get('disabled')) {
                return false;
            }

            var task = this.get('task');
            var taskName = this.get('task.name');
            var lastTaskName = this.get('task.last.task.name');

            // task-buttons are never disabled whilst running so that clicks when a
            // taskGroup is running don't get dropped BUT that means we need to check
            // here to avoid spamming actions from multiple clicks
            if (this.get('isRunning') && taskName === lastTaskName) {
                return;
            }

            (0, _emberInvokeAction.invokeAction)(this, 'action');
            task.perform();

            this.get('_restartAnimation').perform();

            // prevent the click from bubbling and triggering form actions
            return false;
        },


        setSize: observer('isRunning', function () {
            if (this.get('isRunning')) {
                this.set('hasRun', true);
                // this.$().width(this.$().width());
                // this.$().height(this.$().height());
            } else {
                    // this.$().width('');
                    // this.$().height('');
                }
        }),

        // when local validation fails there's no transition from failed->running
        // so we want to restart the retry spinner animation to show something
        // has happened when the button is clicked
        _restartAnimation: (0, _emberConcurrency.task)(regeneratorRuntime.mark(function _callee() {
            var elem;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            if (!this.$('.retry-animated').length) {
                                _context.next = 6;
                                break;
                            }

                            elem = this.$('.retry-animated')[0];

                            elem.classList.remove('retry-animated');
                            _context.next = 5;
                            return (0, _emberConcurrency.timeout)(10);

                        case 5:
                            elem.classList.add('retry-animated');

                        case 6:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }))
    });

    GhTaskButton.reopenClass({
        positionalParams: ['buttonText']
    });

    exports.default = GhTaskButton;
});