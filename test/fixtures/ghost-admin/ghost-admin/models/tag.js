define('ghost-admin/models/tag', ['exports', 'ember-data/model', 'ghost-admin/mixins/validation-engine', 'ember-data/attr'], function (exports, _model, _validationEngine, _attr) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var equal = Ember.computed.equal;
    var observer = Ember.observer;
    var service = Ember.inject.service;
    exports.default = _model.default.extend(_validationEngine.default, {
        validationType: 'tag',

        name: (0, _attr.default)('string'),
        slug: (0, _attr.default)('string'),
        description: (0, _attr.default)('string'),
        parent: (0, _attr.default)(),
        metaTitle: (0, _attr.default)('string'),
        metaDescription: (0, _attr.default)('string'),
        featureImage: (0, _attr.default)('string'),
        visibility: (0, _attr.default)('string', { defaultValue: 'public' }),
        createdAtUTC: (0, _attr.default)('moment-utc'),
        updatedAtUTC: (0, _attr.default)('moment-utc'),
        createdBy: (0, _attr.default)(),
        updatedBy: (0, _attr.default)(),
        count: (0, _attr.default)('raw'),

        isInternal: equal('visibility', 'internal'),
        isPublic: equal('visibility', 'public'),

        feature: service(),

        setVisibility: function setVisibility() {
            var internalRegex = /^#.?/;
            this.set('visibility', internalRegex.test(this.get('name')) ? 'internal' : 'public');
        },
        save: function save() {
            if (this.get('changedAttributes.name') && !this.get('isDeleted')) {
                this.setVisibility();
            }
            return this._super.apply(this, arguments);
        },


        setVisibilityOnNew: observer('isNew', 'isSaving', 'name', function () {
            if (this.get('isNew') && !this.get('isSaving')) {
                this.setVisibility();
            }
        }).on('init')
    });
});