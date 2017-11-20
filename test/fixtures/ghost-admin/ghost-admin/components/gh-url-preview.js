define('ghost-admin/components/gh-url-preview', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var computed = Ember.computed;
    var service = Ember.inject.service;
    exports.default = Component.extend({
        classNames: 'ghost-url-preview',
        prefix: null,
        slug: null,

        config: service(),

        url: computed('slug', function () {
            // Get the blog URL and strip the scheme
            var blogUrl = this.get('config.blogUrl');
            // Remove `http[s]://`
            var noSchemeBlogUrl = blogUrl.substr(blogUrl.indexOf('://') + 3);

            // Get the prefix and slug values
            var prefix = this.get('prefix') ? this.get('prefix') + '/' : '';
            var slug = this.get('slug') ? this.get('slug') + '/' : '';

            // Join parts of the URL together with slashes
            var theUrl = noSchemeBlogUrl + '/' + prefix + slug;

            return theUrl;
        })
    });
});