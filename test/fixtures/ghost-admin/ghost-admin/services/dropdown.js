define('ghost-admin/services/dropdown', ['exports', 'ghost-admin/mixins/body-event-listener'], function (exports, _bodyEventListener) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var $ = Ember.$;
    var Evented = Ember.Evented;
    var Service = Ember.Service;
    exports.default = Service.extend(Evented, _bodyEventListener.default, {
        bodyClick: function bodyClick(event) {
            var dropdownSelector = '.ember-basic-dropdown-trigger, .ember-basic-dropdown-content';

            if ($(event.target).closest(dropdownSelector).length <= 0) {
                this.closeDropdowns();
            }
        },
        closeDropdowns: function closeDropdowns() {
            this.trigger('close');
        },
        toggleDropdown: function toggleDropdown(dropdownName, dropdownButton) {
            this.trigger('toggle', { target: dropdownName, button: dropdownButton });
        }
    });
});