define('ghost-admin/services/clock', ['exports', 'moment'], function (exports, _moment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Service = Ember.Service;
    var run = Ember.run;
    var testing = Ember.testing;


    var ONE_SECOND = 1000;

    // Creates a clock service to run intervals.

    exports.default = Service.extend({
        second: null,
        minute: null,
        hour: null,

        init: function init() {
            this.tick();
        },
        tick: function tick() {
            var _this = this;

            var now = (0, _moment.default)().utc();

            this.setProperties({
                second: now.seconds(),
                minute: now.minutes(),
                hour: now.hours()
            });

            if (!testing) {
                run.later(function () {
                    _this.tick();
                }, ONE_SECOND);
            }
        }
    });
});