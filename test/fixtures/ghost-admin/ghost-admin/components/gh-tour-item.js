define('ghost-admin/components/gh-tour-item', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var computed = Ember.computed;
    var isBlank = Ember.isBlank;
    var reads = Ember.computed.reads;
    var run = Ember.run;
    var service = Ember.inject.service;


    var instancesCounter = 0;

    var triangleClassPositions = {
        'top-left': {
            attachment: 'top left',
            targetAttachment: 'bottom center',
            offset: '0 28px'
        },
        'top': {
            attachment: 'top center',
            targetAttachment: 'bottom center'
        },
        'top-right': {
            attachment: 'top right',
            targetAttachment: 'bottom center',
            offset: '0 -28px'
        },
        'right-top': {
            attachment: 'top right',
            targetAttachment: 'middle left',
            offset: '28px 0'
        },
        'right': {
            attachment: 'middle right',
            targetAttachment: 'middle left'
        },
        'right-bottom': {
            attachment: 'bottom right',
            targetAttachment: 'middle left',
            offset: '-28px 0'
        },
        'bottom-right': {
            attachment: 'bottom right',
            targetAttachment: 'top center',
            offset: '0 -28px'
        },
        'bottom': {
            attachment: 'bottom center',
            targetAttachment: 'top center'
        },
        'bottom-left': {
            attachment: 'bottom left',
            targetAttachment: 'top center',
            offset: '0 28px'
        },
        'left-bottom': {
            attachment: 'bottom left',
            targetAttachment: 'middle right',
            offset: '-28px 0'
        },
        'left': {
            attachment: 'middle left',
            targetAttachment: 'middle right'
        },
        'left-top': {
            attachment: 'top left',
            targetAttachment: 'middle right',
            offset: '28px 0'
        }
    };

    var GhTourItemComponent = Component.extend({

        mediaQueries: service(),
        tour: service(),

        tagName: '',

        throbberId: null,
        target: null,
        throbberAttachment: 'middle center',
        popoverTriangleClass: 'top',
        isOpen: false,

        _elementId: null,
        _throbber: null,
        _throbberElementId: null,
        _throbberElementSelector: null,
        _popoverAttachment: null,
        _popoverTargetAttachment: null,
        _popoverOffset: null,

        isMobile: reads('mediaQueries.isMobile'),
        isVisible: computed('isMobile', '_throbber', function () {
            var isMobile = this.get('isMobile');
            var hasThrobber = !isBlank(this.get('_throbber'));

            return !isMobile && hasThrobber;
        }),

        init: function init() {
            this._super.apply(this, arguments);
            // this is a tagless component so we need to generate our own elementId
            this._elementId = instancesCounter++;
            this._throbberElementId = 'throbber-' + this._elementId;
            this._throbberElementSelector = '#throbber-' + this._elementId;

            this._handleOptOut = run.bind(this, this._remove);
            this._handleViewed = run.bind(this, this._removeIfViewed);

            this.get('tour').on('optOut', this._handleOptOut);
            this.get('tour').on('viewed', this._handleViewed);
        },
        didReceiveAttrs: function didReceiveAttrs() {
            var throbberId = this.get('throbberId');
            var throbber = this.get('tour').activeThrobber(throbberId);
            var triangleClass = this.get('popoverTriangleClass');
            var popoverPositions = triangleClassPositions[triangleClass];

            this._throbber = throbber;
            this._popoverAttachment = popoverPositions.attachment;
            this._popoverTargetAttachment = popoverPositions.targetAttachment;
            this._popoverOffset = popoverPositions.offset;
        },
        willDestroyElement: function willDestroyElement() {
            this.get('tour').off('optOut', this._handleOptOut);
            this.get('tour').off('viewed', this._handleViewed);
            this._super.apply(this, arguments);
        },
        _removeIfViewed: function _removeIfViewed(id) {
            if (id === this.get('throbberId')) {
                this._remove();
            }
        },
        _remove: function _remove() {
            this.set('_throbber', null);
        },
        _close: function _close() {
            this.set('isOpen', false);
        },


        actions: {
            open: function open() {
                this.set('isOpen', true);
            },
            close: function close() {
                this._close();
            },
            markAsViewed: function markAsViewed() {
                var throbberId = this.get('throbberId');
                this.get('tour').markThrobberAsViewed(throbberId);
                this.set('_throbber', null);
                this._close();
            },
            optOut: function optOut() {
                this.get('tour').optOut();
                this.set('_throbber', null);
                this._close();
            }
        }
    });

    GhTourItemComponent.reopenClass({
        positionalParams: ['throbberId']
    });

    exports.default = GhTourItemComponent;
});