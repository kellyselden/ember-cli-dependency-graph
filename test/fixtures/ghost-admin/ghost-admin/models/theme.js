define('ghost-admin/models/theme', ['exports', 'ember-data/model', 'ember-data/attr'], function (exports, _model, _attr) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var computed = Ember.computed;
    var isBlank = Ember.isBlank;
    exports.default = _model.default.extend({
        active: (0, _attr.default)('boolean'),
        errors: (0, _attr.default)('raw'),
        name: (0, _attr.default)('string'),
        package: (0, _attr.default)('raw'),
        templates: (0, _attr.default)('raw', { defaultValue: function defaultValue() {
                return [];
            } }),
        warnings: (0, _attr.default)('raw'),

        customTemplates: computed('templates.[]', function () {
            var templates = this.get('templates') || [];

            return templates.filter(function (template) {
                return isBlank(template.slug);
            });
        }),

        slugTemplates: computed('templates.[]', function () {
            var templates = this.get('templates') || [];

            return templates.filter(function (template) {
                return !isBlank(template.slug);
            });
        }),

        activate: function activate() {
            var _this = this;

            var adapter = this.store.adapterFor(this.constructor.modelName);

            return adapter.activate(this).then(function () {
                // the server only gives us the newly active theme back so we need
                // to manually mark other themes as inactive in the store
                var activeThemes = _this.store.peekAll('theme').filterBy('active', true);

                activeThemes.forEach(function (theme) {
                    if (theme !== _this) {
                        // store.push is necessary to avoid dirty records that cause
                        // problems when we get new data back in subsequent requests
                        _this.store.push({ data: {
                                id: theme.id,
                                type: 'theme',
                                attributes: { active: false }
                            } });
                    }
                });

                return _this;
            });
        }
    });
});