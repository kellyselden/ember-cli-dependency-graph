define('ghost-admin/components/gh-cm-editor', ['exports', 'ghost-admin/utils/bound-one-way', 'ember-invoke-action'], function (exports, _boundOneWay, _emberInvokeAction) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
                arr2[i] = arr[i];
            }

            return arr2;
        } else {
            return Array.from(arr);
        }
    }

    var Component = Ember.Component;
    var RSVP = Ember.RSVP;
    var assign = Ember.assign;
    var bind = Ember.run.bind;
    var once = Ember.run.once;
    var scheduleOnce = Ember.run.scheduleOnce;
    var service = Ember.inject.service;


    var CmEditorComponent = Component.extend(_emberInvokeAction.InvokeActionMixin, {
        classNameBindings: ['isFocused:focus'],

        _value: (0, _boundOneWay.default)('value'), // make sure a value exists
        isFocused: false,

        // options for the editor
        lineNumbers: true,
        indentUnit: 4,
        mode: 'htmlmixed',
        theme: 'xq-light',

        _editor: null, // reference to CodeMirror editor

        lazyLoader: service(),

        didReceiveAttrs: function didReceiveAttrs() {
            if (this.get('value') === null || undefined) {
                this.set('value', '');
            }
        },
        didInsertElement: function didInsertElement() {
            var _this = this;

            this._super.apply(this, arguments);

            var loader = this.get('lazyLoader');

            RSVP.all([loader.loadStyle('codemirror', 'assets/codemirror/codemirror.css'), loader.loadScript('codemirror', 'assets/codemirror/codemirror.js')]).then(function () {
                scheduleOnce('afterRender', _this, function () {
                    this._initCodeMirror();
                });
            });
        },
        _initCodeMirror: function _initCodeMirror() {
            var options = this.getProperties('lineNumbers', 'indentUnit', 'mode', 'theme', 'autofocus');
            assign(options, { value: this.get('_value') });

            this._editor = new CodeMirror(this.element, options);

            // by default CodeMirror will place the cursor at the beginning of the
            // content, it makes more sense for the cursor to be at the end
            if (options.autofocus) {
                this._editor.setCursor(this._editor.lineCount(), 0);
            }

            // events
            this._setupCodeMirrorEventHandler('focus', this, this._focus);
            this._setupCodeMirrorEventHandler('blur', this, this._blur);
            this._setupCodeMirrorEventHandler('change', this, this._update);
        },
        _setupCodeMirrorEventHandler: function _setupCodeMirrorEventHandler(event, target, method) {
            var callback = bind(target, method);

            this._editor.on(event, callback);

            this.one('willDestroyElement', this, function () {
                this._editor.off(event, callback);
            });
        },
        _update: function _update(codeMirror, changeObj) {
            once(this, this._invokeUpdateAction, codeMirror.getValue(), codeMirror, changeObj);
        },
        _invokeUpdateAction: function _invokeUpdateAction() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            this.invokeAction.apply(this, ['update'].concat(_toConsumableArray(args)));
        },
        _focus: function _focus(codeMirror, event) {
            this.set('isFocused', true);
            once(this, this._invokeFocusAction, codeMirror.getValue(), codeMirror, event);
        },
        _invokeFocusAction: function _invokeFocusAction() {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            this.invokeAction.apply(this, ['focus-in'].concat(_toConsumableArray(args)));
        },
        _blur: function _blur() /* codeMirror, event */{
            this.set('isFocused', false);
        },
        willDestroyElement: function willDestroyElement() {
            this._super.apply(this, arguments);

            // Ensure the editor exists before trying to destroy it. This fixes
            // an error that occurs if codemirror hasn't finished loading before
            // the component is destroyed.
            if (this._editor) {
                var editor = this._editor.getWrapperElement();
                editor.parentNode.removeChild(editor);
                this._editor = null;
            }
        }
    });

    CmEditorComponent.reopenClass({
        positionalParams: ['value']
    });

    exports.default = CmEditorComponent;
});