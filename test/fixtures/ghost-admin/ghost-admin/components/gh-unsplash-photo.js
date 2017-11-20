define('ghost-admin/components/gh-unsplash-photo', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var $ = Ember.$;
    var Component = Ember.Component;
    var computed = Ember.computed;
    var htmlSafe = Ember.String.htmlSafe;
    exports.default = Component.extend({

        height: 0,
        photo: null,
        tagName: '',
        width: 1200,
        zoomed: false,

        // closure actions
        insert: function insert() {},
        zoom: function zoom() {},


        // avoid "binding style attributes" warnings
        style: computed('photo.color', 'zoomed', function () {
            var styles = [];
            var ratio = this.get('photo.ratio');
            var zoomed = this.get('zoomed');

            styles.push('background-color: ' + this.get('photo.color'));

            if (!zoomed) {
                styles.push('padding-bottom: ' + ratio * 100 + '%');
            }

            return htmlSafe(styles.join('; '));
        }),

        imageUrl: computed('photo.urls.regular', function () {
            var url = this.get('photo.urls.regular');

            url = url.replace(/&w=1080/, '&w=1200');

            return url;
        }),

        didReceiveAttrs: function didReceiveAttrs() {
            this._super.apply(this, arguments);

            var height = this.get('width') * this.get('photo.ratio');

            this.set('height', height);
        },


        actions: {
            insert: function insert(event) {
                event.preventDefault();
                event.stopPropagation();
                this.insert(this.get('photo'));
            },
            zoom: function zoom(event) {
                var $target = $(event.target);

                // only zoom when it wasn't one of the child links clicked
                if (!$target.is('a') && $target.closest('a').hasClass('gh-unsplash-photo')) {
                    event.preventDefault();
                    this.zoom(this.get('photo'));
                }

                // don't propagate otherwise we can trigger the closeZoom action on the overlay
                event.stopPropagation();
            }
        }

    });
});