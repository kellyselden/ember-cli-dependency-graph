define('ghost-admin/models/navigation-item', ['exports', 'ghost-admin/mixins/validation-engine'], function (exports, _validationEngine) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var EmberObject = Ember.Object;
    var computed = Ember.computed;
    var isBlank = Ember.isBlank;
    exports.default = EmberObject.extend(_validationEngine.default, {
        label: '',
        url: '',
        isNew: false,

        validationType: 'navItem',

        isComplete: computed('label', 'url', function () {
            var _getProperties = this.getProperties('label', 'url'),
                label = _getProperties.label,
                url = _getProperties.url;

            return !isBlank(label) && !isBlank(url);
        }),

        isBlank: computed('label', 'url', function () {
            var _getProperties2 = this.getProperties('label', 'url'),
                label = _getProperties2.label,
                url = _getProperties2.url;

            return isBlank(label) && isBlank(url);
        })
    });
});