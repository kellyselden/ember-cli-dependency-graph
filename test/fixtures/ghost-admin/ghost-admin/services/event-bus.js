define('ghost-admin/services/event-bus', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Evented = Ember.Evented;
    var Service = Ember.Service;
    exports.default = Service.extend(Evented, {
        publish: function publish() {
            return this.trigger.apply(this, arguments);
        },
        subscribe: function subscribe() {
            return this.on.apply(this, arguments);
        },
        unsubscribe: function unsubscribe() {
            return this.off.apply(this, arguments);
        }
    });
});