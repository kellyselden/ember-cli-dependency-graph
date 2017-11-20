define('ghost-admin/components/gh-editor-post-status', ['exports', 'ember-concurrency'], function (exports, _emberConcurrency) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var computed = Ember.computed;
    var reads = Ember.computed.reads;
    var testing = Ember.testing;


    // TODO: reduce when in testing mode
    var SAVE_TIMEOUT_MS = testing ? 0 : 3000;

    exports.default = Component.extend({
        post: null,
        isNew: reads('post.isNew'),
        isScheduled: reads('post.isScheduled'),
        isSaving: false,

        'data-test-editor-post-status': true,

        _isSaving: false,

        isPublished: computed('post.{isPublished,pastScheduledTime}', function () {
            var isPublished = this.get('post.isPublished');
            var pastScheduledTime = this.get('post.pastScheduledTime');

            return isPublished || pastScheduledTime;
        }),

        // isSaving will only be true briefly whilst the post is saving,
        // we want to ensure that the "Saving..." message is shown for at least
        // a few seconds so that it's noticeable
        didReceiveAttrs: function didReceiveAttrs() {
            if (this.get('isSaving')) {
                this.get('showSavingMessage').perform();
            }
        },


        showSavingMessage: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            this.set('_isSaving', true);
                            _context.next = 3;
                            return (0, _emberConcurrency.timeout)(SAVE_TIMEOUT_MS);

                        case 3:
                            this.set('_isSaving', false);

                        case 4:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        })).drop()
    });
});