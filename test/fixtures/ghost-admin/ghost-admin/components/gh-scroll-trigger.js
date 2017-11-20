define('ghost-admin/components/gh-scroll-trigger', ['exports', 'ember-in-viewport'], function (exports, _emberInViewport) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    exports.default = Component.extend(_emberInViewport.default, {
        onEnterViewport: function onEnterViewport() {},
        didInsertElement: function didInsertElement() {
            var offset = this.get('triggerOffset');

            this.set('viewportSpy', true);
            this.set('viewportTolerance', {
                top: offset,
                bottom: offset,
                left: offset,
                right: offset
            });

            this._super.apply(this, arguments);
        },
        didEnterViewport: function didEnterViewport() {
            return this.onEnterViewport();
        }
    });
});