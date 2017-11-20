define('ghost-admin/models/slack-integration', ['exports', 'ghost-admin/mixins/validation-engine'], function (exports, _validationEngine) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var EmberObject = Ember.Object;
    var computed = Ember.computed;
    var isBlank = Ember.isBlank;
    exports.default = EmberObject.extend(_validationEngine.default, {
        // values entered here will act as defaults
        url: '',

        validationType: 'slackIntegration',

        isActive: computed('url', function () {
            var url = this.get('url');
            return !isBlank(url);
        })
    });
});