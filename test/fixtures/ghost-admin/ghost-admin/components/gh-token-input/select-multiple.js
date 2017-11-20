define('ghost-admin/components/gh-token-input/select-multiple', ['exports', 'ember-power-select/components/power-select-multiple'], function (exports, _powerSelectMultiple) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var $ = Ember.$;
    var bind = Ember.run.bind;


    var endActions = 'click.ghToken mouseup.ghToken touchend.ghToken';

    // triggering focus on the search input within ESA's onfocus event breaks the
    // drag-n-drop functionality in ember-drag-drop so we watch for events that
    // could be the start of a drag and disable the default focus behaviour until
    // we get another event signalling the end of a drag

    exports.default = _powerSelectMultiple.default.extend({

        _canFocus: true,

        willDestroyElement: function willDestroyElement() {
            this._super.apply(this, arguments);

            if (this._allowFocusListener) {
                $(window).off(endActions, this._allowFocusListener);
            }
        },


        actions: {
            optionMouseDown: function optionMouseDown(event) {
                if (event.which === 1 && !event.ctrlKey) {
                    this._denyFocus(event);
                }
            },
            optionTouchStart: function optionTouchStart(event) {
                this._denyFocus(event);
            },
            handleFocus: function handleFocus() {
                if (this._canFocus) {
                    this._super.apply(this, arguments);
                }
            }
        },

        _denyFocus: function _denyFocus() {
            if (this._canFocus) {
                this._canFocus = false;

                this._allowFocusListener = bind(this, this._allowFocus);

                $(window).on(endActions, this._allowFocusListener);
            }
        },
        _allowFocus: function _allowFocus() {
            this._canFocus = true;

            $(window).off(endActions, this._allowFocusListener);
            this._allowFocusListener = null;
        }
    });
});