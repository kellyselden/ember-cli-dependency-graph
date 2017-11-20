define('ghost-admin/components/gh-textarea', ['exports', 'ember-one-way-controls/components/one-way-textarea', 'ghost-admin/mixins/text-input'], function (exports, _oneWayTextarea, _textInput) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var run = Ember.run;
    var service = Ember.inject.service;
    exports.default = _oneWayTextarea.default.extend(_textInput.default, {
        resizeDetector: service(),

        classNames: 'gh-input',

        autoExpand: false,

        willInsertElement: function willInsertElement() {
            this._super.apply(this, arguments);

            // disable the draggable resize element that browsers add to textareas
            if (this.get('autoExpand')) {
                this.element.style.resize = 'none';
            }
        },
        didInsertElement: function didInsertElement() {
            this._super.apply(this, arguments);

            // set up resize handler on element insert so that we can autoexpand
            // when the element container changes size
            if (this.get('autoExpand')) {
                run.scheduleOnce('afterRender', this, this._setupAutoExpand);
            }
        },
        didReceiveAttrs: function didReceiveAttrs() {
            this._super.apply(this, arguments);

            // trigger auto-expand any time the value changes
            if (this.get('autoExpand')) {
                run.scheduleOnce('afterRender', this, this._autoExpand);
            }
        },
        willDestroyElement: function willDestroyElement() {
            this._teardownAutoExpand();
            this._super.apply(this, arguments);
        },
        _autoExpand: function _autoExpand() {
            var el = this.element;

            // collapse the element first so that we can shrink as well as expand
            // then set the height to match the text height
            if (el) {
                el.style.height = 0;
                el.style.height = el.scrollHeight + 'px';
            }
        },
        _setupAutoExpand: function _setupAutoExpand() {
            this._resizeCallback = run.bind(this, this._onResize);
            this.get('resizeDetector').setup(this.get('autoExpand'), this._resizeCallback);
            this._autoExpand();
        },
        _onResize: function _onResize() {
            this._autoExpand();
        },
        _teardownAutoExpand: function _teardownAutoExpand() {
            this.get('resizeDetector').teardown(this.get('autoExpand'), this._resizeCallback);
        }
    });
});