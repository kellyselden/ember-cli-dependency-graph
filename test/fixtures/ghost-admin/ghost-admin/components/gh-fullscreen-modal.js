define('ghost-admin/components/gh-fullscreen-modal', ['exports', 'ember-invoke-action'], function (exports, _emberInvokeAction) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var RSVP = Ember.RSVP;
    var computed = Ember.computed;
    var emberA = Ember.A;
    var isBlank = Ember.isBlank;
    var run = Ember.run;
    var service = Ember.inject.service;


    var FullScreenModalComponent = Component.extend({

        model: null,
        modifier: null,

        dropdown: service(),

        modalPath: computed('modal', function () {
            return 'modal-' + (this.get('modal') || 'unknown');
        }),

        modalClasses: computed('modifiers', function () {
            var modalClass = 'fullscreen-modal';
            var modifiers = (this.get('modifier') || '').split(' ');
            var modalClasses = emberA([modalClass]);

            modifiers.forEach(function (modifier) {
                if (!isBlank(modifier)) {
                    var className = modalClass + '-' + modifier;
                    modalClasses.push(className);
                }
            });

            return modalClasses.join(' ');
        }),

        didInsertElement: function didInsertElement() {
            run.schedule('afterRender', this, function () {
                this.get('dropdown').closeDropdowns();
            });
        },


        actions: {
            close: function close() {
                // Because we return the promise from invokeAction, we have
                // to check if "close" exists first
                if (this.get('close')) {
                    return (0, _emberInvokeAction.invokeAction)(this, 'close');
                }

                return RSVP.resolve();
            },
            confirm: function confirm() {
                if (this.get('confirm')) {
                    return (0, _emberInvokeAction.invokeAction)(this, 'confirm');
                }

                return RSVP.resolve();
            },
            clickOverlay: function clickOverlay() {
                this.send('close');
            }
        }
    });

    FullScreenModalComponent.reopenClass({
        positionalParams: ['modal']
    });

    exports.default = FullScreenModalComponent;
});