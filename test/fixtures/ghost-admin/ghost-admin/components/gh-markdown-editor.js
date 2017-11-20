define('ghost-admin/components/gh-markdown-editor', ['exports', 'ghost-admin/mixins/shortcuts', 'ghost-admin/utils/ctrl-or-cmd', 'ghost-admin/utils/format-markdown'], function (exports, _shortcuts, _ctrlOrCmd, _formatMarkdown) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.BLANK_DOC = undefined;
    var Component = Ember.Component;
    var assign = Ember.assign;
    var computed = Ember.computed;
    var copy = Ember.copy;
    var htmlSafe = Ember.String.htmlSafe;
    var isEmpty = Ember.isEmpty;
    var typeOf = Ember.typeOf;
    var run = Ember.run;
    var service = Ember.inject.service;


    var MOBILEDOC_VERSION = '0.3.1';

    var BLANK_DOC = exports.BLANK_DOC = {
        version: MOBILEDOC_VERSION,
        markups: [],
        atoms: [],
        cards: [['card-markdown', {
            cardName: 'card-markdown',
            markdown: ''
        }]],
        sections: [[10, 0]]
    };

    exports.default = Component.extend(_shortcuts.default, {

        config: service(),
        notifications: service(),
        settings: service(),

        classNames: ['gh-markdown-editor'],
        classNameBindings: ['_isFullScreen:gh-markdown-editor-full-screen', '_isSplitScreen:gh-markdown-editor-side-by-side'],

        // Public attributes
        autofocus: false,
        imageMimeTypes: null,
        isFullScreen: false,
        mobiledoc: null,
        options: null,
        placeholder: '',
        uploadedImageUrls: null,

        // Closure actions
        onChange: function onChange() {},
        onFullScreenToggle: function onFullScreenToggle() {},
        onImageFilesSelected: function onImageFilesSelected() {},
        onPreviewToggle: function onPreviewToggle() {},
        onSplitScreenToggle: function onSplitScreenToggle() {},
        showMarkdownHelp: function showMarkdownHelp() {},


        // Internal attributes
        markdown: null,

        // Private
        _editor: null,
        _editorFocused: false,
        _isFullScreen: false,
        _isSplitScreen: false,
        _isHemingwayMode: false,
        _isUploading: false,
        _showUnsplash: false,
        _statusbar: null,
        _toolbar: null,
        _uploadedImageUrls: null,

        simpleMDEOptions: computed('options', function () {
            var _this = this;

            var options = this.get('options') || {};
            var defaultOptions = {
                // use our Showdown config with sanitization for previews
                previewRender: function previewRender(markdown) {
                    return (0, _formatMarkdown.default)(markdown);
                },


                // Ghost-specific SimpleMDE toolbar config - allows us to create a
                // bridge between SimpleMDE buttons and Ember actions
                toolbar: ['bold', 'italic', 'heading', '|', 'quote', 'unordered-list', 'ordered-list', '|', 'link', {
                    name: 'image',
                    action: function action() {
                        _this._openImageFileDialog();
                    },
                    className: 'fa fa-picture-o',
                    title: 'Upload Image(s)'
                }, '|', {
                    name: 'preview',
                    action: function action() {
                        _this._togglePreview();
                    },
                    className: 'fa fa-eye no-disable',
                    title: 'Render Preview (Ctrl-Alt-R)',
                    useCtrlOnMac: true
                }, {
                    name: 'side-by-side',
                    action: function action() {
                        _this.send('toggleSplitScreen');
                    },
                    className: 'fa fa-columns no-disable no-mobile',
                    title: 'Side-by-side Preview (Ctrl-Alt-P)',
                    useCtrlOnMac: true
                }, '|', {
                    name: 'spellcheck',
                    action: function action() {
                        _this._toggleSpellcheck();
                    },
                    className: 'fa fa-check',
                    title: 'Spellcheck (Ctrl-Alt-S)',
                    useCtrlOnMac: true
                }, {
                    name: 'hemingway',
                    action: function action() {
                        _this._toggleHemingway();
                    },
                    className: 'fa fa-h-square',
                    title: 'Hemingway Mode (Ctrl-Alt-H)',
                    useCtrlOnMac: true
                }, {
                    name: 'guide',
                    action: function action() {
                        _this.showMarkdownHelp();
                    },
                    className: 'fa fa-question-circle',
                    title: 'Markdown Guide'
                }],

                // disable shortcuts for side-by-side and fullscreen because they
                // trigger interal SimpleMDE methods that will result in broken
                // layouts
                shortcuts: {
                    toggleFullScreen: null,
                    togglePreview: null,
                    toggleSideBySide: null,
                    drawImage: null
                },

                // only include the number of words in the status bar
                status: ['words']
            };

            if (this.get('settings.unsplash.isActive')) {
                var image = defaultOptions.toolbar.findBy('name', 'image');
                var index = defaultOptions.toolbar.indexOf(image) + 1;

                defaultOptions.toolbar.splice(index, 0, {
                    name: 'unsplash',
                    action: function action() {
                        _this.send('toggleUnsplash');
                    },
                    className: 'fa fa-camera',
                    title: 'Add Image from Unsplash'
                });
            }

            return assign(defaultOptions, options);
        }),

        shortcuts: {},

        init: function init() {
            this._super.apply(this, arguments);
            var shortcuts = this.get('shortcuts');

            shortcuts[_ctrlOrCmd.default + '+shift+i'] = { action: 'openImageFileDialog' };
            shortcuts['ctrl+alt+r'] = { action: 'togglePreview' };
            shortcuts['ctrl+alt+p'] = { action: 'toggleSplitScreen' };
            shortcuts['ctrl+alt+s'] = { action: 'toggleSpellcheck' };
            shortcuts['ctrl+alt+h'] = { action: 'toggleHemingway' };
        },


        // extract markdown content from single markdown card
        didReceiveAttrs: function didReceiveAttrs() {
            var _this2 = this;

            this._super.apply(this, arguments);
            var mobiledoc = this.get('mobiledoc') || copy(BLANK_DOC, true);

            var uploadedImageUrls = this.get('uploadedImageUrls');
            if (!isEmpty(uploadedImageUrls) && uploadedImageUrls !== this._uploadedImageUrls) {
                this._uploadedImageUrls = uploadedImageUrls;

                // must be done afterRender to avoid double modify of mobiledoc in
                // a single render
                run.scheduleOnce('afterRender', this, function () {
                    _this2._insertImages(uploadedImageUrls);
                    // reset the file input so the same file can be selected again
                    _this2.$('input[type=file]').val('');
                });
            }

            // eslint-disable-next-line ember-suave/prefer-destructuring
            var markdown = mobiledoc.cards[0][1].markdown;
            this.set('markdown', markdown);

            // use internal values to avoid updating bound values
            if (!isEmpty(this.get('isFullScreen'))) {
                this.set('_isFullScreen', this.get('isFullScreen'));
            }
            if (!isEmpty(this.get('isSplitScreen'))) {
                this.set('_isSplitScreen', this.get('isSplitScreen'));
            }

            this._updateButtonState();
        },
        didInsertElement: function didInsertElement() {
            this._super.apply(this, arguments);
            this.registerShortcuts();
        },
        _insertImages: function _insertImages(urls) {
            var cm = this._editor.codemirror;

            // loop through urls and generate image markdown
            var images = urls.map(function (url) {
                // plain url string, so extract filename from path
                if (typeOf(url) === 'string') {
                    var filename = url.split('/').pop();
                    var alt = filename;

                    // if we have a normal filename.ext, set alt to filename -ext
                    if (filename.lastIndexOf('.') > 0) {
                        alt = filename.slice(0, filename.lastIndexOf('.'));
                    }

                    return '![' + alt + '](' + url + ')';

                    // full url object, use attrs we're given
                } else {
                    var image = '![' + url.alt + '](' + url.url + ')';

                    if (url.credit) {
                        image += '\n' + url.credit;
                    }

                    return image;
                }
            });
            var text = images.join('\n\n');

            // clicking the image toolbar button will lose the selection so we use
            // the captured selection to re-select here
            if (this._imageInsertSelection) {
                // we want to focus but not re-position
                this.send('focusEditor', null);

                // re-select and clear the captured selection so drag/drop still
                // inserts at the correct place
                cm.setSelection(this._imageInsertSelection.anchor, this._imageInsertSelection.head);
                this._imageInsertSelection = null;
            }

            // focus editor and place cursor at end if not already focused
            if (!cm.hasFocus()) {
                this.send('focusEditor');
                text = '\n\n' + text + '\n\n';
            }

            // insert at cursor or replace selection then position cursor at end
            // of inserted text
            cm.replaceSelection(text, 'end');
        },


        // mark the split-pane/full-screen/spellcheck buttons active when they're active
        _updateButtonState: function _updateButtonState() {
            if (this._editor) {
                var sideBySideButton = this._editor.toolbarElements['side-by-side'];
                var spellcheckButton = this._editor.toolbarElements.spellcheck;
                var hemingwayButton = this._editor.toolbarElements.hemingway;

                if (sideBySideButton) {
                    if (this.get('_isSplitScreen')) {
                        sideBySideButton.classList.add('active');
                    } else {
                        sideBySideButton.classList.remove('active');
                    }
                }

                if (spellcheckButton) {
                    if (this._editor.codemirror.getOption('mode') === 'spell-checker') {
                        spellcheckButton.classList.add('active');
                    } else {
                        spellcheckButton.classList.remove('active');
                    }
                }

                if (hemingwayButton) {
                    if (this._isHemingwayMode) {
                        hemingwayButton.classList.add('active');
                    } else {
                        hemingwayButton.classList.remove('active');
                    }
                }
            }
        },


        // set up the preview auto-update and scroll sync
        _connectSplitPreview: function _connectSplitPreview() {
            var cm = this._editor.codemirror;
            var editor = this._editor;
            /* eslint-disable ember-suave/prefer-destructuring */
            var editorPane = this.$('.gh-markdown-editor-pane')[0];
            var previewPane = this.$('.gh-markdown-editor-preview')[0];
            var previewContent = this.$('.gh-markdown-editor-preview-content')[0];
            /* eslint-enable ember-suave/prefer-destructuring */

            this._editorPane = editorPane;
            this._previewPane = previewPane;
            this._previewContent = previewContent;

            // from SimpleMDE -------
            var sideBySideRenderingFunction = function sideBySideRenderingFunction() {
                previewContent.innerHTML = editor.options.previewRender(editor.value(), previewContent);
            };

            cm.sideBySideRenderingFunction = sideBySideRenderingFunction;

            sideBySideRenderingFunction();
            cm.on('update', cm.sideBySideRenderingFunction);

            // Refresh to fix selection being off (#309)
            cm.refresh();
            // ----------------------

            this._onEditorPaneScroll = this._scrollHandler.bind(this);
            editorPane.addEventListener('scroll', this._onEditorPaneScroll, false);
            this._scrollSync();
        },
        _scrollHandler: function _scrollHandler() {
            if (!this._scrollSyncTicking) {
                requestAnimationFrame(this._scrollSync.bind(this));
            }
            this._scrollSyncTicking = true;
        },
        _scrollSync: function _scrollSync() {
            var editorPane = this._editorPane;
            var previewPane = this._previewPane;
            var height = editorPane.scrollHeight - editorPane.clientHeight;
            var ratio = parseFloat(editorPane.scrollTop) / height;
            var move = (previewPane.scrollHeight - previewPane.clientHeight) * ratio;

            previewPane.scrollTop = move;
            this._scrollSyncTicking = false;
        },
        _disconnectSplitPreview: function _disconnectSplitPreview() {
            var cm = this._editor.codemirror;

            cm.off('update', cm.sideBySideRenderingFunction);
            cm.refresh();

            this._editorPane.removeEventListener('scroll', this._onEditorPaneScroll, false);
            delete this._previewPane;
            delete this._previewPaneContent;
            delete this._onEditorPaneScroll;
        },
        _openImageFileDialog: function _openImageFileDialog() {
            var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                _ref$captureSelection = _ref.captureSelection,
                captureSelection = _ref$captureSelection === undefined ? true : _ref$captureSelection;

            if (captureSelection) {
                // capture the current selection before it's lost by clicking the
                // file input button
                this._imageInsertSelection = {
                    anchor: this._editor.codemirror.getCursor('anchor'),
                    head: this._editor.codemirror.getCursor('head')
                };
            }

            // trigger the dialog via gh-file-input, when a file is selected it will
            // trigger the onImageFilesSelected closure action
            this.$('input[type="file"]').click();
        },


        // wrap SimpleMDE's built-in preview toggle so that we can trigger a closure
        // action that can apply our own classes higher up in the DOM
        _togglePreview: function _togglePreview() {
            this.onPreviewToggle(!this._editor.isPreviewActive());
            this._editor.togglePreview();
        },
        _toggleSpellcheck: function _toggleSpellcheck() {
            var cm = this._editor.codemirror;

            if (cm.getOption('mode') === 'spell-checker') {
                cm.setOption('mode', 'gfm');
            } else {
                cm.setOption('mode', 'spell-checker');
            }

            this._updateButtonState();
        },
        _toggleHemingway: function _toggleHemingway() {
            var cm = this._editor.codemirror;
            var extraKeys = cm.getOption('extraKeys');
            var notificationText = '';

            this._isHemingwayMode = !this._isHemingwayMode;

            if (this._isHemingwayMode) {
                notificationText = '<span class="gh-notification-title">Hemingway Mode On:</span> Write now; edit later. Backspace disabled.';
                extraKeys.Backspace = function () {};
            } else {
                notificationText = '<span class="gh-notification-title">Hemingway Mode Off:</span> Normal editing restored.';
                delete extraKeys.Backspace;
            }

            cm.setOption('extraKeys', extraKeys);
            this._updateButtonState();

            cm.focus();

            this.get('notifications').showNotification(htmlSafe(notificationText), { key: 'editor.hemingwaymode' });
        },
        willDestroyElement: function willDestroyElement() {
            if (this.get('_isSplitScreen')) {
                this._disconnectSplitPreview();
            }

            this.removeShortcuts();

            this._super.apply(this, arguments);
        },


        actions: {
            // put the markdown into a new mobiledoc card, trigger external update
            updateMarkdown: function updateMarkdown(markdown) {
                var mobiledoc = copy(BLANK_DOC, true);
                mobiledoc.cards[0][1].markdown = markdown;
                this.onChange(mobiledoc);
            },


            // store a reference to the simplemde editor so that we can handle
            // focusing and image uploads
            setEditor: function setEditor(editor) {
                this._editor = editor;

                // disable CodeMirror's drag/drop handling as we want to handle that
                // in the parent gh-editor component
                this._editor.codemirror.setOption('dragDrop', false);

                // default to spellchecker being off
                this._editor.codemirror.setOption('mode', 'gfm');

                // HACK: move the toolbar & status bar elements outside of the
                // editor container so that they can be aligned in fixed positions
                var container = this.$().closest('.gh-editor').find('.gh-editor-footer');
                this._toolbar = this.$('.editor-toolbar');
                this._statusbar = this.$('.editor-statusbar');
                this._toolbar.appendTo(container);
                this._statusbar.appendTo(container);

                this._updateButtonState();
            },


            // used by the title input when the TAB or ENTER keys are pressed
            focusEditor: function focusEditor() {
                var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'bottom';

                this._editor.codemirror.focus();

                if (position === 'bottom') {
                    this._editor.codemirror.execCommand('goDocEnd');
                } else if (position === 'top') {
                    this._editor.codemirror.execCommand('goDocStart');
                }

                return false;
            },


            // HACK FIXME (PLEASE):
            // - clicking toolbar buttons will cause the editor to lose focus
            // - this is painful because we often want to know if the editor has focus
            //   so that we can insert images and so on in the correct place
            // - the blur event will always fire before the button action is triggered 😞
            // - to work around this we track focus state manually and set it to false
            //   after an arbitrary period that's long enough to allow the button action
            //   to trigger first
            // - this _may_ well have unknown issues due to browser differences,
            //   variations in performance, moon cycles, sun spots, or cosmic rays
            // - here be 🐲
            // - (please let it work 🙏)
            updateFocusState: function updateFocusState(focused) {
                if (focused) {
                    this._editorFocused = true;
                } else {
                    run.later(this, function () {
                        this._editorFocused = false;
                    }, 100);
                }
            },
            openImageFileDialog: function openImageFileDialog() {
                var captureSelection = this._editor.codemirror.hasFocus();
                this._openImageFileDialog({ captureSelection: captureSelection });
            },
            toggleUnsplash: function toggleUnsplash() {
                if (this.get('_showUnsplash')) {
                    return this.toggleProperty('_showUnsplash');
                }

                // capture current selection before it's lost by clicking toolbar btn
                if (this._editorFocused) {
                    this._imageInsertSelection = {
                        anchor: this._editor.codemirror.getCursor('anchor'),
                        head: this._editor.codemirror.getCursor('head')
                    };
                }

                this.toggleProperty('_showUnsplash');
            },
            insertUnsplashPhoto: function insertUnsplashPhoto(photo) {
                var image = {
                    alt: photo.description || '',
                    url: photo.urls.regular,
                    credit: '<small>Photo by [' + photo.user.name + '](' + photo.user.links.html + '?utm_source=ghost&utm_medium=referral&utm_campaign=api-credit) / [Unsplash](https://unsplash.com/?utm_source=ghost&utm_medium=referral&utm_campaign=api-credit)</small>'
                };

                this._insertImages([image]);
            },
            togglePreview: function togglePreview() {
                this._togglePreview();
            },
            toggleFullScreen: function toggleFullScreen() {
                var isFullScreen = !this.get('_isFullScreen');

                this.set('_isFullScreen', isFullScreen);
                this._updateButtonState();
                this.onFullScreenToggle(isFullScreen);

                // leave split screen when exiting full screen mode
                if (!isFullScreen && this.get('_isSplitScreen')) {
                    this.send('toggleSplitScreen');
                }
            },
            toggleSplitScreen: function toggleSplitScreen() {
                var isSplitScreen = !this.get('_isSplitScreen');
                var previewButton = this._editor.toolbarElements.preview;

                this.set('_isSplitScreen', isSplitScreen);
                this._updateButtonState();

                // set up the preview rendering and scroll sync
                // afterRender is needed so that necessary components have been
                // added/removed and editor pane length has settled
                if (isSplitScreen) {
                    // disable the normal SimpleMDE preview if it's active
                    if (this._editor.isPreviewActive()) {
                        var preview = this._editor.toolbar.find(function (button) {
                            return button.name === 'preview';
                        });

                        preview.action(this._editor);
                    }

                    if (previewButton) {
                        previewButton.classList.add('disabled');
                    }

                    run.scheduleOnce('afterRender', this, this._connectSplitPreview);
                } else {
                    if (previewButton) {
                        previewButton.classList.remove('disabled');
                    }

                    run.scheduleOnce('afterRender', this, this._disconnectSplitPreview);
                }

                this.onSplitScreenToggle(isSplitScreen);

                // go fullscreen when entering split screen mode
                this.send('toggleFullScreen');
            },
            toggleSpellcheck: function toggleSpellcheck() {
                this._toggleSpellcheck();
            },
            toggleHemingway: function toggleHemingway() {
                this._toggleHemingway();
            },


            // put the toolbar/statusbar elements back so that SimpleMDE doesn't throw
            // errors when it tries to remove them
            destroyEditor: function destroyEditor() {
                var container = this.$('.gh-markdown-editor-pane');
                this._toolbar.appendTo(container);
                this._statusbar.appendTo(container);
                this._editor = null;
            }
        }
    });
});