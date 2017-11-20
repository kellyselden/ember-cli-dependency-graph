define('ghost-admin/components/gh-datetime-input', ['exports', 'ghost-admin/utils/bound-one-way', 'moment', 'ember-invoke-action', 'ghost-admin/utils/date-formatting'], function (exports, _boundOneWay, _moment, _emberInvokeAction, _dateFormatting) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var service = Ember.inject.service;
    exports.default = Component.extend(_emberInvokeAction.InvokeActionMixin, {
        tagName: 'span',
        classNames: 'gh-input-icon gh-icon-calendar',

        datetime: (0, _boundOneWay.default)('value'),
        inputClass: null,
        inputId: null,
        inputName: null,
        settings: service(),

        didReceiveAttrs: function didReceiveAttrs() {
            var datetime = this.get('datetime') || _moment.default.utc();
            var blogTimezone = this.get('settings.activeTimezone');

            if (!this.get('update')) {
                throw new Error('You must provide an `update` action to `{{' + this.templateName + '}}`.');
            }

            this.set('datetime', (0, _dateFormatting.formatDate)(datetime || _moment.default.utc(), blogTimezone));
        },
        focusOut: function focusOut() {
            var datetime = this.get('datetime');

            this.invokeAction('update', datetime);
        }
    });
});