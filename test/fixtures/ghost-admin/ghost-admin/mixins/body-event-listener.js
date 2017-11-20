define('ghost-admin/mixins/body-event-listener', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var $ = Ember.$;
    var Mixin = Ember.Mixin;
    var run = Ember.run;


    function K() {
        return this;
    }

    // Code modified from Addepar/ember-widgets
    // https://github.com/Addepar/ember-widgets/blob/master/src/mixins.coffee#L39

    exports.default = Mixin.create({
        bodyElementSelector: 'html',
        bodyClick: K,

        init: function init() {
            this._super.apply(this, arguments);

            return run.next(this, this._setupDocumentHandlers);
        },
        willDestroy: function willDestroy() {
            this._super.apply(this, arguments);

            return this._removeDocumentHandlers();
        },
        _setupDocumentHandlers: function _setupDocumentHandlers() {
            var _this = this;

            if (this._clickHandler) {
                return;
            }

            this._clickHandler = function (event) {
                return _this.bodyClick(event);
            };

            return $(this.get('bodyElementSelector')).on('click', this._clickHandler);
        },
        _removeDocumentHandlers: function _removeDocumentHandlers() {
            $(this.get('bodyElementSelector')).off('click', this._clickHandler);
            this._clickHandler = null;
        },


        // http://stackoverflow.com/questions/152975/how-to-detect-a-click-outside-an-element
        click: function click(event) {
            return event.stopPropagation();
        }
    });
});