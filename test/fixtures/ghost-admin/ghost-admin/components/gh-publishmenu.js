define('ghost-admin/components/gh-publishmenu', ['exports', 'ember-concurrency'], function (exports, _emberConcurrency) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var $ = Ember.$;
    var Component = Ember.Component;
    var computed = Ember.computed;
    var reads = Ember.computed.reads;
    var service = Ember.inject.service;
    exports.default = Component.extend({
        clock: service(),

        classNames: 'gh-publishmenu',
        post: null,
        saveTask: null,

        _publishedAtBlogTZ: null,

        isClosing: null,

        forcePublishedMenu: reads('post.pastScheduledTime'),

        postState: computed('post.{isPublished,isScheduled}', 'forcePublishedMenu', function () {
            if (this.get('forcePublishedMenu') || this.get('post.isPublished')) {
                return 'published';
            } else if (this.get('post.isScheduled')) {
                return 'scheduled';
            } else {
                return 'draft';
            }
        }),

        triggerText: computed('postState', function () {
            var state = this.get('postState');

            if (state === 'published') {
                return 'Update';
            } else if (state === 'scheduled') {
                return 'Scheduled';
            } else {
                return 'Publish';
            }
        }),

        _runningText: computed('postState', 'saveType', function () {
            var saveType = this.get('saveType');
            var postState = this.get('postState');
            var runningText = void 0;

            if (postState === 'draft') {
                runningText = saveType === 'publish' ? 'Publishing' : 'Scheduling';
            }

            if (postState === 'published') {
                runningText = saveType === 'publish' ? 'Updating' : 'Unpublishing';
            }

            if (postState === 'scheduled') {
                runningText = saveType === 'schedule' ? 'Rescheduling' : 'Unscheduling';
            }

            return runningText || 'Publishing';
        }),

        runningText: null,

        buttonText: computed('postState', 'saveType', function () {
            var saveType = this.get('saveType');
            var postState = this.get('postState');
            var buttonText = void 0;

            if (postState === 'draft') {
                buttonText = saveType === 'publish' ? 'Publish' : 'Schedule';
            }

            if (postState === 'published') {
                buttonText = saveType === 'publish' ? 'Update' : 'Unpublish';
            }

            if (postState === 'scheduled') {
                buttonText = saveType === 'schedule' ? 'Reschedule' : 'Unschedule';
            }

            return buttonText || 'Publish';
        }),

        successText: computed('_previousStatus', 'postState', function () {
            var postState = this.get('postState');
            var previousStatus = this.get('_previousStatus');
            var buttonText = void 0;

            if (previousStatus === 'draft') {
                buttonText = postState === 'published' ? 'Published' : 'Scheduled';
            }

            if (previousStatus === 'published') {
                buttonText = postState === 'draft' ? 'Unpublished' : 'Updated';
            }

            if (previousStatus === 'scheduled') {
                buttonText = postState === 'draft' ? 'Unscheduled' : 'Rescheduled';
            }

            return buttonText;
        }),

        save: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var post;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            // runningText needs to be declared before the other states change during the
                            // save action.
                            this.set('runningText', this.get('_runningText'));
                            this.set('_previousStatus', this.get('post.status'));
                            this.get('setSaveType')(this.get('saveType'));

                            _context.prev = 3;
                            _context.next = 6;
                            return this.get('post').validate({ property: 'publishedAtBlog' });

                        case 6:
                            _context.next = 8;
                            return this.get('saveTask').perform();

                        case 8:
                            post = _context.sent;


                            this._cachePublishedAtBlogTZ();
                            return _context.abrupt('return', post);

                        case 13:
                            _context.prev = 13;
                            _context.t0 = _context['catch'](3);

                            if (!_context.t0) {
                                _context.next = 17;
                                break;
                            }

                            throw _context.t0;

                        case 17:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[3, 13]]);
        })),

        _previousStatus: null,

        _cachePublishedAtBlogTZ: function _cachePublishedAtBlogTZ() {
            this._publishedAtBlogTZ = this.get('post.publishedAtBlogTZ');
        },


        // when closing the menu we reset the publishedAtBlogTZ date so that the
        // unsaved changes made to the scheduled date aren't reflected in the PSM
        _resetPublishedAtBlogTZ: function _resetPublishedAtBlogTZ() {
            this.get('post').set('publishedAtBlogTZ', this._publishedAtBlogTZ);
        },


        actions: {
            setSaveType: function setSaveType(saveType) {
                var post = this.get('post');

                this.set('saveType', saveType);

                if (saveType === 'draft') {
                    post.set('statusScratch', 'draft');
                } else if (saveType === 'schedule') {
                    post.set('statusScratch', 'scheduled');
                } else if (saveType === 'publish') {
                    post.set('statusScratch', 'published');
                }
            },
            open: function open() {
                this._cachePublishedAtBlogTZ();
                this.set('isClosing', false);
                this.get('post.errors').clear();
                if (this.get('onOpen')) {
                    this.get('onOpen')();
                }
            },
            close: function close(dropdown, e) {
                var post = this.get('post');

                // don't close the menu if the datepicker popup is clicked
                if (e && $(e.target).closest('.ember-power-datepicker-content').length) {
                    return false;
                }

                // cleanup
                this._resetPublishedAtBlogTZ();
                post.set('statusScratch', null);
                post.validate();

                if (this.get('onClose')) {
                    this.get('onClose')();
                }

                this.set('isClosing', true);

                return true;
            }
        }
    });
});