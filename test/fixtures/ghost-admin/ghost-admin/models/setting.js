define('ghost-admin/models/setting', ['exports', 'ember-data/model', 'ghost-admin/mixins/validation-engine', 'ember-data/attr'], function (exports, _model, _validationEngine, _attr) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _model.default.extend(_validationEngine.default, {
        validationType: 'setting',

        title: (0, _attr.default)('string'),
        description: (0, _attr.default)('string'),
        logo: (0, _attr.default)('string'),
        coverImage: (0, _attr.default)('string'),
        icon: (0, _attr.default)('string'),
        defaultLocale: (0, _attr.default)('string'),
        forceI18n: (0, _attr.default)('boolean'),
        permalinks: (0, _attr.default)('string'),
        activeTimezone: (0, _attr.default)('string', { defaultValue: 'Etc/UTC' }),
        ghostHead: (0, _attr.default)('string'),
        ghostFoot: (0, _attr.default)('string'),
        facebook: (0, _attr.default)('facebook-url-user'),
        twitter: (0, _attr.default)('twitter-url-user'),
        labs: (0, _attr.default)('string'),
        navigation: (0, _attr.default)('navigation-settings'),
        isPrivate: (0, _attr.default)('boolean'),
        publicHash: (0, _attr.default)('string'),
        password: (0, _attr.default)('string'),
        slack: (0, _attr.default)('slack-settings'),
        amp: (0, _attr.default)('boolean'),
        unsplash: (0, _attr.default)('unsplash-settings', {
            defaultValue: function defaultValue() {
                return { isActive: true };
            }
        })
    });
});