define('ghost-admin/components/gh-simplemde', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var TextArea = Ember.TextArea;
    var assign = Ember.assign;
    var computed = Ember.computed;
    var isEmpty = Ember.isEmpty;
    var testing = Ember.testing;
    exports.default = TextArea.extend({

        // Public attributes
        autofocus: false,
        options: null,
        value: null,
        placeholder: '',

        // Closure actions
        onChange: function onChange() {},
        onEditorInit: function onEditorInit() {},
        onEditorDestroy: function onEditorDestroy() {},


        // Private
        _editor: null,

        // default SimpleMDE options, see docs for available config:
        // https://github.com/NextStepWebs/simplemde-markdown-editor#configuration
        defaultOptions: computed(function () {
            return {
                autofocus: this.get('autofocus'),
                indentWithTabs: false,
                placeholder: this.get('placeholder'),
                tabSize: 4
            };
        }),

        init: function init() {
            this._super.apply(this, arguments);

            if (isEmpty(this.get('options'))) {
                this.set('options', {});
            }
        },


        // instantiate the editor with the contents of value
        didInsertElement: function didInsertElement() {
            var _this = this;

            this._super.apply(this, arguments);

            var editorOptions = assign({ element: document.getElementById(this.elementId) }, this.get('defaultOptions'), this.get('options'));

            // disable spellchecker when testing so that the exterally loaded plugin
            // doesn't fail
            if (testing) {
                editorOptions.spellChecker = false;
            }

            this._editor = new SimpleMDE(editorOptions);
            this._editor.value(this.get('value') || '');

            this._editor.codemirror.on('change', function () {
                _this.onChange(_this._editor.value());
            });

            this._editor.codemirror.on('focus', function () {
                _this.onFocus();
            });

            this._editor.codemirror.on('blur', function () {
                _this.onBlur();
            });

            if (this.get('autofocus')) {
                this._editor.codemirror.execCommand('goDocEnd');
            }

            this.onEditorInit(this._editor);
        },


        // update the editor when the value property changes from the outside
        didReceiveAttrs: function didReceiveAttrs() {
            this._super.apply(this, arguments);

            if (isEmpty(this._editor)) {
                return;
            }

            // compare values before forcing a content reset to avoid clobbering
            // the undo behaviour
            if (this.get('value') !== this._editor.value()) {
                var cursor = this._editor.codemirror.getDoc().getCursor();
                this._editor.value(this.get('value'));
                this._editor.codemirror.getDoc().setCursor(cursor);
            }
        },
        willDestroyElement: function willDestroyElement() {
            this.onEditorDestroy();
            this._editor.toTextArea();
            delete this._editor;
            this._super.apply(this, arguments);
        }
    });
});