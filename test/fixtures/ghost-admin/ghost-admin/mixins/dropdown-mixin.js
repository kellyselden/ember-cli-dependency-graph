define('ghost-admin/mixins/dropdown-mixin', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Evented = Ember.Evented;
    var Mixin = Ember.Mixin;
    exports.default = Mixin.create(Evented, {
        classNameBindings: ['isOpen:open:closed'],
        isOpen: false,

        click: function click(event) {
            this._super(event);

            return event.stopPropagation();
        }
    });
});