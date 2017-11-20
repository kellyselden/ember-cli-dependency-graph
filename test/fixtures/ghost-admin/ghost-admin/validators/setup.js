define('ghost-admin/validators/setup', ['exports', 'ghost-admin/validators/new-user'], function (exports, _newUser) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _newUser.default.create({
        properties: ['name', 'email', 'password', 'blogTitle'],

        blogTitle: function blogTitle(model) {
            var blogTitle = model.get('blogTitle');

            if (!validator.isLength(blogTitle, 1)) {
                model.get('errors').add('blogTitle', 'Please enter a blog title.');
                this.invalidate();
            }

            if (!validator.isLength(blogTitle, 0, 150)) {
                model.get('errors').add('blogTitle', 'Title is too long');
                this.invalidate();
            }
        }
    });
});