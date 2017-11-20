define('ghost-admin/routes/editor/index', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Route = Ember.Route;
    exports.default = Route.extend({
        beforeModel: function beforeModel() {
            this._super.apply(this, arguments);
            this.transitionTo('editor.new');
        }
    });
});