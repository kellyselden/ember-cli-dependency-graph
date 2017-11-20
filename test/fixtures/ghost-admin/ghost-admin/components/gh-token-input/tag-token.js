define('ghost-admin/components/gh-token-input/tag-token', ['exports', 'ember-drag-drop/components/draggable-object'], function (exports, _draggableObject) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var computed = Ember.computed;
    var readOnly = Ember.computed.readOnly;
    exports.default = _draggableObject.default.extend({

        attributeBindings: ['title'],
        classNames: ['tag-token'],
        classNameBindings: ['primary:tag-token--primary', 'internal:tag-token--internal'],

        content: readOnly('option'),
        internal: readOnly('option.isInternal'),

        primary: computed('idx', 'internal', function () {
            return !this.get('internal') && this.get('idx') === 0;
        }),

        title: computed('option.name', 'primary', 'internal', function () {
            var name = this.get('option.name');

            if (this.get('internal')) {
                return name + ' (internal)';
            }

            if (this.get('primary')) {
                return name + ' (primary tag)';
            }

            return name;
        })

    });
});