define('ghost-admin/components/gh-tags-management-container', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var computed = Ember.computed;
    var equal = Ember.computed.equal;
    var reads = Ember.computed.reads;
    var isBlank = Ember.isBlank;
    var observer = Ember.observer;
    var run = Ember.run;
    var service = Ember.inject.service;
    exports.default = Component.extend({
        classNames: ['view-container'],
        classNameBindings: ['isMobile'],

        mediaQueries: service(),

        tags: null,
        selectedTag: null,

        isMobile: reads('mediaQueries.maxWidth600'),
        isEmpty: equal('tags.length', 0),

        init: function init() {
            this._super.apply(this, arguments);
            run.schedule('actions', this, this.fireMobileChangeActions);
        },


        displaySettingsPane: computed('isEmpty', 'selectedTag', 'isMobile', function () {
            var isEmpty = this.get('isEmpty');
            var selectedTag = this.get('selectedTag');
            var isMobile = this.get('isMobile');

            // always display settings pane for blank-slate on mobile
            if (isMobile && isEmpty) {
                return true;
            }

            // display list if no tag is selected on mobile
            if (isMobile && isBlank(selectedTag)) {
                return false;
            }

            // default to displaying settings pane
            return true;
        }),

        fireMobileChangeActions: observer('isMobile', function () {
            if (!this.get('isMobile')) {
                this.sendAction('leftMobile');
            }
        })
    });
});