define('ghost-admin/utils/text-field', [], function () {
    'use strict';

    var TextField = Ember.TextField;


    TextField.reopen({
        attributeBindings: ['autofocus']
    });
});