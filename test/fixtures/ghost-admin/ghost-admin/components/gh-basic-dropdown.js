define('ghost-admin/components/gh-basic-dropdown', ['exports', 'ember-basic-dropdown/components/basic-dropdown', 'ember-basic-dropdown/templates/components/basic-dropdown'], function (exports, _basicDropdown, _basicDropdown2) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var service = Ember.inject.service;
    exports.default = _basicDropdown.default.extend({
        dropdown: service(),

        layout: _basicDropdown2.default,

        didInsertElement: function didInsertElement() {
            this._super.apply(this, arguments);
            this.get('dropdown').on('close', this, this.close);
        },
        willDestroyElement: function willDestroyElement() {
            this._super.apply(this, arguments);
            this.get('dropdown').off('close');
        }
    });
});