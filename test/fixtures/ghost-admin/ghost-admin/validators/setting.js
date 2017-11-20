define('ghost-admin/validators/setting', ['exports', 'ghost-admin/validators/base'], function (exports, _base) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _base.default.create({
        properties: ['title', 'description', 'password'],
        title: function title(model) {
            var title = model.get('title');

            if (!validator.isLength(title, 0, 150)) {
                model.get('errors').add('title', 'Title is too long');
                this.invalidate();
            }
        },
        description: function description(model) {
            var desc = model.get('description');

            if (!validator.isLength(desc, 0, 200)) {
                model.get('errors').add('description', 'Description is too long');
                this.invalidate();
            }
        },
        password: function password(model) {
            var isPrivate = model.get('isPrivate');
            var password = model.get('password');

            if (isPrivate && password === '') {
                model.get('errors').add('password', 'Password must be supplied');
                this.invalidate();
            }
        }
    });
});