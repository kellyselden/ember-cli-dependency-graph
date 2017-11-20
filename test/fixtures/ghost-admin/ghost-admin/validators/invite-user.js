define('ghost-admin/validators/invite-user', ['exports', 'ghost-admin/validators/base'], function (exports, _base) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _base.default.create({
        properties: ['email'],

        email: function email(model) {
            var email = model.get('email');

            if (validator.empty(email)) {
                model.get('errors').add('email', 'Please enter an email.');
                this.invalidate();
            } else if (!validator.isEmail(email)) {
                model.get('errors').add('email', 'Invalid Email.');
                this.invalidate();
            }
        }
    });
});