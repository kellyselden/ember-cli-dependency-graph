define('ghost-admin/controllers/settings/tags', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Controller = Ember.Controller;
    var controller = Ember.inject.controller;
    var alias = Ember.computed.alias;
    var equal = Ember.computed.equal;
    var sort = Ember.computed.sort;
    var run = Ember.run;
    exports.default = Controller.extend({

        tagController: controller('settings.tags.tag'),

        selectedTag: alias('tagController.tag'),

        tagListFocused: equal('keyboardFocus', 'tagList'),
        tagContentFocused: equal('keyboardFocus', 'tagContent'),

        // TODO: replace with ordering by page count once supported by the API
        sortedTags: sort('model', function (a, b) {
            var idA = +a.get('id');
            var idB = +b.get('id');

            if (idA > idB) {
                return 1;
            } else if (idA < idB) {
                return -1;
            }

            return 0;
        }),

        scrollTagIntoView: function scrollTagIntoView(tag) {
            run.scheduleOnce('afterRender', this, function () {
                var id = '#gh-tag-' + tag.get('id');
                var element = document.querySelector(id);

                if (element) {
                    var scroll = document.querySelector('.tag-list');
                    var scrollTop = scroll.scrollTop;

                    var scrollHeight = scroll.offsetHeight;
                    var _element = document.querySelector(id);
                    var elementTop = _element.offsetTop;
                    var elementHeight = _element.offsetHeight;

                    if (elementTop < scrollTop) {
                        _element.scrollIntoView(true);
                    }

                    if (elementTop + elementHeight > scrollTop + scrollHeight) {
                        _element.scrollIntoView(false);
                    }
                }
            });
        },


        actions: {
            leftMobile: function leftMobile() {
                var firstTag = this.get('tags.firstObject');
                // redirect to first tag if possible so that you're not left with
                // tag settings blank slate when switching from portrait to landscape
                if (firstTag && !this.get('tagController.tag')) {
                    this.transitionToRoute('settings.tags.tag', firstTag);
                }
            }
        }

    });
});