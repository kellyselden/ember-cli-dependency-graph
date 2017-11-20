define('ghost-admin/components/gh-feature-flag', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var computed = Ember.computed;
    var service = Ember.inject.service;


    var FeatureFlagComponent = Component.extend({
        tagName: 'label',
        classNames: 'checkbox',
        attributeBindings: ['for'],
        _flagValue: null,

        feature: service(),

        init: function init() {
            this._super.apply(this, arguments);

            this.set('_flagValue', this.get('feature.' + this.get('flag')));
        },


        value: computed('_flagValue', {
            get: function get() {
                return this.get('_flagValue');
            },
            set: function set(key, value) {
                return this.set('feature.' + this.get('flag'), value);
            }
        }),

        for: computed('flag', function () {
            return 'labs-' + this.get('flag');
        }),

        name: computed('flag', function () {
            return 'labs[' + this.get('flag') + ']';
        })
    });

    FeatureFlagComponent.reopenClass({
        positionalParams: ['flag']
    });

    exports.default = FeatureFlagComponent;
});