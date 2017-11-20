define('ghost-admin/components/modal-upload-image', ['exports', 'ghost-admin/components/modal-base', 'ghost-admin/utils/caja-sanitizers', 'ember-concurrency'], function (exports, _modalBase, _cajaSanitizers, _emberConcurrency) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var computed = Ember.computed;
    var isEmpty = Ember.isEmpty;
    var service = Ember.inject.service;
    exports.default = _modalBase.default.extend({
        model: null,

        url: '',
        newUrl: '',
        _isUploading: false,

        config: service(),
        notifications: service(),

        image: computed('model.model', 'model.imageProperty', {
            get: function get() {
                var imageProperty = this.get('model.imageProperty');

                return this.get('model.model.' + imageProperty);
            },
            set: function set(key, value) {
                var model = this.get('model.model');
                var imageProperty = this.get('model.imageProperty');

                return model.set(imageProperty, value);
            }
        }),

        didReceiveAttrs: function didReceiveAttrs() {
            var image = this.get('image');
            this.set('url', image);
            this.set('newUrl', image);
        },


        // TODO: should validation be handled in the gh-image-uploader component?
        //  pro - consistency everywhere, simplification here
        //  con - difficult if the "save" is happening externally as it does here
        //
        //  maybe it should be handled at the model level?
        //      - automatically present everywhere
        //      - file uploads should always result in valid urls so it should only
        //        affect the url input form
        keyDown: function keyDown() {
            this._setErrorState(false);
        },
        _setErrorState: function _setErrorState(state) {
            if (state) {
                this.$('.url').addClass('error');
            } else {
                this.$('.url').removeClass('error');
            }
        },
        _validateUrl: function _validateUrl(url) {
            if (!isEmpty(url) && !_cajaSanitizers.default.url(url)) {
                this._setErrorState(true);
                return { message: 'Image URI is not valid' };
            }

            return true;
        },

        // end validation

        uploadImage: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var model, newUrl, result, notifications;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            model = this.get('model.model');
                            newUrl = this.get('newUrl');
                            result = this._validateUrl(newUrl);
                            notifications = this.get('notifications');

                            if (!(result === true)) {
                                _context.next = 17;
                                break;
                            }

                            this.set('image', newUrl);

                            _context.prev = 6;
                            _context.next = 9;
                            return model.save();

                        case 9:
                            _context.next = 14;
                            break;

                        case 11:
                            _context.prev = 11;
                            _context.t0 = _context['catch'](6);

                            notifications.showAPIError(_context.t0, { key: 'image.upload' });

                        case 14:
                            _context.prev = 14;

                            this.send('closeModal');
                            return _context.finish(14);

                        case 17:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[6, 11, 14, 17]]);
        })).drop(),

        actions: {
            fileUploaded: function fileUploaded(url) {
                this.set('url', url);
                this.set('newUrl', url);
            },
            removeImage: function removeImage() {
                this.set('url', '');
                this.set('newUrl', '');
            },
            confirm: function confirm() {
                this.get('uploadImage').perform();
            },
            isUploading: function isUploading() {
                this.toggleProperty('_isUploading');
            }
        }
    });
});