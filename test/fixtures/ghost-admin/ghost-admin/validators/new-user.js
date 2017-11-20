define('ghost-admin/validators/new-user', ['exports', 'ghost-admin/validators/password'], function (exports, _password) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _password.default.extend({
        properties: ['name', 'email', 'password'],

        name: function name(model) {
            var name = model.get('name');

            if (!validator.isLength(name, 1)) {
                model.get('errors').add('name', 'Please enter a name.');
                this.invalidate();
            }
        },
        email: function email(model) {
            var email = model.get('email');

            if (validator.empty(email)) {
                model.get('errors').add('email', 'Please enter an email.');
                this.invalidate();
            } else if (!validator.isEmail(email)) {
                model.get('errors').add('email', 'Invalid Email.');
                this.invalidate();
            }
        },
        password: function password(model) {
            this.passwordValidation(model);
        }
    });
});