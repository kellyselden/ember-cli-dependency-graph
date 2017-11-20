define('ghost-admin/components/gh-navitem', ['exports', 'ghost-admin/mixins/validation-state'], function (exports, _validationState) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var alias = Ember.computed.alias;
    var readOnly = Ember.computed.readOnly;
    var computed = Ember.computed;
    var run = Ember.run;
    exports.default = Component.extend(_validationState.default, {
        classNames: 'gh-blognav-item',
        classNameBindings: ['errorClass', 'navItem.isNew::gh-blognav-item--sortable'],

        new: false,

        model: alias('navItem'),
        errors: readOnly('navItem.errors'),

        errorClass: computed('hasError', function () {
            if (this.get('hasError')) {
                return 'gh-blognav-item--error';
            }
        }),

        keyPress: function keyPress(event) {
            // enter key
            if (event.keyCode === 13 && this.get('navItem.isNew')) {
                event.preventDefault();
                run.scheduleOnce('actions', this, function () {
                    this.send('addItem');
                });
            }
        },


        actions: {
            addItem: function addItem() {
                this.sendAction('addItem');
            },
            deleteItem: function deleteItem(item) {
                this.sendAction('deleteItem', item);
            },
            updateUrl: function updateUrl(value) {
                this.sendAction('updateUrl', value, this.get('navItem'));
            },
            updateLabel: function updateLabel(value) {
                this.sendAction('updateLabel', value, this.get('navItem'));
            },
            clearLabelErrors: function clearLabelErrors() {
                this.get('navItem.errors').remove('label');
            },
            clearUrlErrors: function clearUrlErrors() {
                this.get('navItem.errors').remove('url');
            }
        }
    });
});