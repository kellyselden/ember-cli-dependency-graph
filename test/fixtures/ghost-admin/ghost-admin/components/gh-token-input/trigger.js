define('ghost-admin/components/gh-token-input/trigger', ['exports', 'ember-power-select/components/power-select-multiple/trigger'], function (exports, _trigger) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var copy = Ember.copy;
    exports.default = _trigger.default.extend({

        actions: {
            handleOptionMouseDown: function handleOptionMouseDown(event) {
                var action = this.get('extra.optionMouseDown');
                if (action) {
                    return action(event);
                }
            },
            handleOptionTouchStart: function handleOptionTouchStart(event) {
                var action = this.get('extra.optionTouchStart');
                if (action) {
                    return action(event);
                }
            },
            reorderItems: function reorderItems() {
                // ember-drag-drop's sortable-objects has two-way bindings and will
                // update EPS' selected value directly. We have to create a copy
                // after sorting in order to force the onchange action to be triggered
                this.get('select').actions.select(copy(this.get('select.selected')));
            }
        }
    });
});