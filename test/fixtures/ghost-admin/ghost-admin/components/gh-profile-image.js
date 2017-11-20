define('ghost-admin/components/gh-profile-image', ['exports', 'ember-ajax/request', 'ember-concurrency'], function (exports, _request, _emberConcurrency) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var $ = Ember.$;
    var Component = Ember.Component;
    var htmlSafe = Ember.String.htmlSafe;
    var service = Ember.inject.service;


    var ANIMATION_TIMEOUT = 1000;

    /**
     * A component to manage a user profile image. By default it just handles picture uploads,
     * but if passed a bound 'email' property it will render the user's gravatar image
     *
     * Example: {{gh-profile-image email=controllerEmailProperty setImage="controllerActionName" debounce=500}}
     *
     * @param  {int}            size              The size of the image to render
     * @param  {String}         email             Reference to a bound email object if gravatar image behavior is desired.
     * @param  {String|action}  setImage          The string name of the action on the controller to be called when an image is added.
     * @param  {int}            debounce          Period to wait after changes to email before attempting to load gravatar
     * @property  {Boolean}     hasUploadedImage  Whether or not the user has uploaded an image (whether or not to show the default image/gravatar image)
     * @property  {String}      defaultImage      String containing the background-image css property of the default user profile image
     * @property  {String}      imageBackground   String containing the background-image css property with the gravatar url
     */
    exports.default = Component.extend({
        email: '',
        size: 180,
        debounce: 300,

        imageFile: null,
        hasUploadedImage: false,

        // closure actions
        setImage: function setImage() {},


        config: service(),
        ghostPaths: service(),

        placeholderStyle: htmlSafe('background-image: url()'),
        avatarStyle: htmlSafe('display: none'),

        _defaultImageUrl: '',

        init: function init() {
            this._super.apply(this, arguments);

            this._defaultImageUrl = this.get('ghostPaths.assetRoot') + 'img/user-image.png';
            this._setPlaceholderImage(this._defaultImageUrl);
        },
        didReceiveAttrs: function didReceiveAttrs() {
            this._super.apply(this, arguments);

            if (this.get('config.useGravatar')) {
                this.get('setGravatar').perform();
            }
        },
        dragOver: function dragOver(event) {
            if (!event.dataTransfer) {
                return;
            }

            // this is needed to work around inconsistencies with dropping files
            // from Chrome's downloads bar
            var eA = event.dataTransfer.effectAllowed;
            event.dataTransfer.dropEffect = eA === 'move' || eA === 'linkMove' ? 'move' : 'copy';

            event.stopPropagation();
            event.preventDefault();
        },
        dragLeave: function dragLeave(event) {
            event.preventDefault();
        },
        drop: function drop(event) {
            event.preventDefault();

            if (event.dataTransfer.files) {
                this.send('imageSelected', event.dataTransfer.files);
            }
        },


        setGravatar: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var email, size, gravatarUrl;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return (0, _emberConcurrency.timeout)(this.get('debounce'));

                        case 2:
                            email = this.get('email');

                            if (!validator.isEmail(email)) {
                                _context.next = 19;
                                break;
                            }

                            size = this.get('size');
                            gravatarUrl = '//www.gravatar.com/avatar/' + window.md5(email) + '?s=' + size + '&d=404';
                            _context.prev = 6;
                            _context.next = 9;
                            return (0, _request.default)(gravatarUrl, { type: 'HEAD' });

                        case 9:
                            // gravatar exists so switch style and let browser load it
                            this._setAvatarImage(gravatarUrl);
                            // wait for fade-in animation to finish before removing placeholder
                            _context.next = 12;
                            return (0, _emberConcurrency.timeout)(ANIMATION_TIMEOUT);

                        case 12:
                            this._setPlaceholderImage('');

                            _context.next = 19;
                            break;

                        case 15:
                            _context.prev = 15;
                            _context.t0 = _context['catch'](6);

                            // gravatar doesn't exist so make sure we're still showing the placeholder
                            this._setPlaceholderImage(this._defaultImageUrl);
                            // then make sure the avatar isn't visible
                            this._setAvatarImage('');

                        case 19:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[6, 15]]);
        })).restartable(),

        _setPlaceholderImage: function _setPlaceholderImage(url) {
            this.set('placeholderStyle', htmlSafe('background-image: url(' + url + ');'));
        },
        _setAvatarImage: function _setAvatarImage(url) {
            var display = url ? 'block' : 'none';
            this.set('avatarStyle', htmlSafe('background-image: url(' + url + '); display: ' + display));
        },
        queueFile: function queueFile(e, data) {
            var fileName = data.files[0].name;

            if (/\.(gif|jpe?g|png|svg?z)$/i.test(fileName)) {
                this.sendAction('setImage', data);
            }
        },


        actions: {
            imageSelected: function imageSelected(fileList) {
                var _this = this;

                // eslint-disable-next-line
                var imageFile = fileList[0];

                if (imageFile) {
                    var reader = new FileReader();

                    this.set('imageFile', imageFile);
                    this.setImage(imageFile);

                    reader.addEventListener('load', function () {
                        var dataURL = reader.result;
                        _this.set('previewDataURL', dataURL);
                    }, false);

                    reader.readAsDataURL(imageFile);
                }
            },
            openFileDialog: function openFileDialog(event) {
                var fileInput = $(event.target).closest('figure').find('input[type="file"]');

                if (fileInput.length > 0) {
                    // reset file input value before clicking so that the same image
                    // can be selected again
                    fileInput.value = '';

                    // simulate click to open file dialog
                    // using jQuery because IE11 doesn't support MouseEvent
                    $(fileInput).click();
                }
            }
        }
    });
});