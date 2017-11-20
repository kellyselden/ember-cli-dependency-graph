define('ghost-admin/components/modal-base', ['exports', 'ember-invoke-action'], function (exports, _emberInvokeAction) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var run = Ember.run;
    exports.default = Component.extend({
        tagName: 'section',
        classNames: 'modal-content',

        _previousKeymasterScope: null,

        _setupShortcuts: function _setupShortcuts() {
            var _this = this;

            run(function () {
                document.activeElement.blur();
            });
            this._previousKeymasterScope = key.getScope();

            key('enter', 'modal', function () {
                _this.send('confirm');
            });

            key('escape', 'modal', function () {
                _this.send('closeModal');
            });

            key.setScope('modal');
        },
        _removeShortcuts: function _removeShortcuts() {
            key.unbind('enter', 'modal');
            key.unbind('escape', 'modal');

            key.setScope(this._previousKeymasterScope);
        },
        didInsertElement: function didInsertElement() {
            this._super.apply(this, arguments);
            this._setupShortcuts();
        },
        willDestroyElement: function willDestroyElement() {
            this._super.apply(this, arguments);
            this._removeShortcuts();
        },


        actions: {
            confirm: function confirm() {
                throw new Error('You must override the "confirm" action in your modal component');
            },
            closeModal: function closeModal() {
                (0, _emberInvokeAction.invokeAction)(this, 'closeModal');
            }
        }
    });
});