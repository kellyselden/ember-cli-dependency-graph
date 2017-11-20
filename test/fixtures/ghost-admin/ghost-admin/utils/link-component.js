define('ghost-admin/utils/link-component', ['ember-invoke-action'], function (_emberInvokeAction) {
    'use strict';

    var LinkComponent = Ember.LinkComponent;
    var computed = Ember.computed;


    LinkComponent.reopen({
        active: computed('attrs.params', '_routing.currentState', function () {
            var isActive = this._super.apply(this, arguments);

            if (typeof this.get('alternateActive') === 'function') {
                (0, _emberInvokeAction.invokeAction)(this, 'alternateActive', isActive);
            }

            return isActive;
        }),

        activeClass: computed('tagName', function () {
            return this.get('tagName') === 'button' ? '' : 'active';
        })
    });
});