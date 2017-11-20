define('ghost-admin/validators/reset', ['exports', 'ghost-admin/validators/password'], function (exports, _password) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _password.default.create({
        properties: ['newPassword'],

        newPassword: function newPassword(model) {
            var p1 = model.get('newPassword');
            var p2 = model.get('ne2Password');

            if (validator.empty(p1)) {
                model.get('errors').add('newPassword', 'Please enter a password.');
                this.invalidate();
            } else if (!validator.equals(p1, p2)) {
                model.get('errors').add('ne2Password', 'The two new passwords don\'t match.');
                this.invalidate();
            }

            this.passwordValidation(model, p1, 'newPassword');
        }
    });
});