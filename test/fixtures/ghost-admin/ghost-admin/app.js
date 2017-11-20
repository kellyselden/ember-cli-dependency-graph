define('ghost-admin/app', ['exports', 'ghost-admin/resolver', 'ghost-admin/config/environment', 'ember-load-initializers', 'ghost-admin/utils/link-component', 'ghost-admin/utils/route', 'ghost-admin/utils/text-field'], function (exports, _resolver, _environment, _emberLoadInitializers) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Application = Ember.Application;


    var App = Application.extend({
        Resolver: _resolver.default,
        modulePrefix: _environment.default.modulePrefix,
        podModulePrefix: _environment.default.podModulePrefix,

        customEvents: {
            touchstart: null,
            touchmove: null,
            touchend: null,
            touchcancel: null
        }
    });

    // TODO: remove once the validations refactor is complete
    // eslint-disable-next-line
    Ember.Debug.registerWarnHandler(function (message, options, next) {
        var skip = ['ds.errors.add', 'ds.errors.remove', 'ds.errors.clear'];

        if (skip.includes(options.id)) {
            return;
        }

        next(message, options);
    });

    (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);

    exports.default = App;
});