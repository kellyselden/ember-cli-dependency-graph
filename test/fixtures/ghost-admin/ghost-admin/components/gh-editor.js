define('ghost-admin/components/gh-editor', ['exports', 'ghost-admin/components/gh-image-uploader'], function (exports, _ghImageUploader) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var run = Ember.run;
    var service = Ember.inject.service;
    var debounce = run.debounce;
    exports.default = Component.extend({
        ui: service(),

        classNameBindings: ['isDraggedOver:-drag-over', 'isFullScreen:gh-editor-fullscreen', 'isPreview:gh-editor-preview'],

        // Public attributes
        navIsClosed: false,

        // Internal attributes
        droppedFiles: null,
        headerClass: '',
        imageExtensions: _ghImageUploader.IMAGE_EXTENSIONS,
        imageMimeTypes: _ghImageUploader.IMAGE_MIME_TYPES,
        isDraggedOver: false,
        isFullScreen: false,
        isSplitScreen: false,
        uploadedImageUrls: null,

        // Private
        _dragCounter: 0,
        _navIsClosed: false,
        _onResizeHandler: null,
        _viewActionsWidth: 190,

        init: function init() {
            var _this = this;

            this._super.apply(this, arguments);
            this._onResizeHandler = function (evt) {
                debounce(_this, _this._setHeaderClass, evt, 100);
            };
        },
        didInsertElement: function didInsertElement() {
            this._super.apply(this, arguments);
            window.addEventListener('resize', this._onResizeHandler);
            this._setHeaderClass();
        },
        didReceiveAttrs: function didReceiveAttrs() {
            var navIsClosed = this.get('navIsClosed');

            if (navIsClosed !== this._navIsClosed) {
                run.scheduleOnce('afterRender', this, this._setHeaderClass);
            }

            this._navIsClosed = navIsClosed;
        },
        _setHeaderClass: function _setHeaderClass() {
            var $editorTitle = this.$('.gh-editor-title');
            var smallHeaderClass = 'gh-editor-header-small';

            if (this.get('isSplitScreen')) {
                this.set('headerClass', smallHeaderClass);
                return;
            }

            if ($editorTitle.length > 0) {
                var boundingRect = $editorTitle[0].getBoundingClientRect();
                var maxRight = window.innerWidth - this._viewActionsWidth;

                if (boundingRect.right >= maxRight) {
                    this.set('headerClass', smallHeaderClass);
                    return;
                }
            }

            this.set('headerClass', '');
        },


        // dragOver is needed so that drop works
        dragOver: function dragOver(event) {
            if (!event.dataTransfer) {
                return;
            }

            // this is needed to work around inconsistencies with dropping files
            // from Chrome's downloads bar
            var eA = event.dataTransfer.effectAllowed;
            event.dataTransfer.dropEffect = eA === 'move' || eA === 'linkMove' ? 'move' : 'copy';

            event.preventDefault();
            event.stopPropagation();
        },


        // dragEnter is needed so that the drag class is correctly removed
        dragEnter: function dragEnter(event) {
            if (!event.dataTransfer) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            // the counter technique prevents flickering of the drag class when
            // dragging across child elements
            this._dragCounter++;

            this.set('isDraggedOver', true);
        },
        dragLeave: function dragLeave(event) {
            event.preventDefault();
            event.stopPropagation();

            this._dragCounter--;
            if (this._dragCounter === 0) {
                this.set('isDraggedOver', false);
            }
        },
        drop: function drop(event) {
            event.preventDefault();
            event.stopPropagation();

            this._dragCounter = 0;
            this.set('isDraggedOver', false);

            if (event.dataTransfer.files) {
                this.set('droppedFiles', event.dataTransfer.files);
            }
        },
        willDestroyElement: function willDestroyElement() {
            this._super.apply(this, arguments);
            window.removeEventListener('resize', this._onResizeHandler);
        },


        actions: {
            toggleFullScreen: function toggleFullScreen(isFullScreen) {
                this.set('isFullScreen', isFullScreen);
                this.get('ui').set('isFullScreen', isFullScreen);
                run.scheduleOnce('afterRender', this, this._setHeaderClass);
            },
            togglePreview: function togglePreview(isPreview) {
                this.set('isPreview', isPreview);
            },
            toggleSplitScreen: function toggleSplitScreen(isSplitScreen) {
                this.set('isSplitScreen', isSplitScreen);
                run.scheduleOnce('afterRender', this, this._setHeaderClass);
            },
            uploadImages: function uploadImages(fileList) {
                this.set('droppedFiles', fileList);
            },
            uploadComplete: function uploadComplete(uploads) {
                this.set('uploadedImageUrls', uploads.mapBy('url'));
                this.set('droppedFiles', null);
            },
            uploadCancelled: function uploadCancelled() {
                this.set('droppedFiles', null);
            }
        }
    });
});