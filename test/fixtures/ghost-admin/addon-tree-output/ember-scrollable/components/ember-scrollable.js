define('ember-scrollable/components/ember-scrollable', ['exports', 'ember', 'ember-component-inbound-actions/inbound-actions', 'ember-lifeline/mixins/dom', 'ember-scrollable/templates/components/ember-scrollable', 'ember-scrollable/classes/scrollable'], function (exports, _ember, _emberComponentInboundActionsInboundActions, _emberLifelineMixinsDom, _emberScrollableTemplatesComponentsEmberScrollable, _emberScrollableClassesScrollable) {
  var _slice = Array.prototype.slice;
  var computed = _ember['default'].computed;
  var deprecate = _ember['default'].deprecate;
  var isPresent = _ember['default'].isPresent;
  var service = _ember['default'].inject.service;
  var _Ember$run = _ember['default'].run;
  var scheduleOnce = _Ember$run.scheduleOnce;
  var debounce = _Ember$run.debounce;
  var throttle = _Ember$run.throttle;

  var hideDelay = _ember['default'].testing ? 16 : 1000;
  var PAGE_JUMP_MULTIPLE = 7 / 8;

  var THROTTLE_TIME_LESS_THAN_60_FPS_IN_MS = 1;exports.THROTTLE_TIME_LESS_THAN_60_FPS_IN_MS = THROTTLE_TIME_LESS_THAN_60_FPS_IN_MS;
  // 60 fps -> 1 sec / 60 = 16ms

  var scrollbarSelector = '.tse-scrollbar';
  var contentSelector = '.tse-content';

  exports['default'] = _ember['default'].Component.extend(_emberComponentInboundActionsInboundActions['default'], _emberLifelineMixinsDom['default'], {
    layout: _emberScrollableTemplatesComponentsEmberScrollable['default'],
    classNameBindings: [':ember-scrollable', ':tse-scrollable', 'horizontal', 'vertical'],

    /**
     * If true, a scrollbar will be shown horizontally
     *
     * @property horizontal
     * @public
     * @type Boolean
     * @default false
     */
    horizontal: null,

    /**
     * If true, a scrollbar will be shown vertically
     *
     * @property vertical
     * @public
     * @type Boolean
     */
    vertical: null,
    /**
     * Indicates whether the scrollbar should auto hide after a given period of time (see hideDelay),
     * or remain persitent alongside the content to be scrolled.
     *
     * @property autoHide
     * @public
     * @type Boolean
     * @default true
     */
    autoHide: true,
    scrollBuffer: 50,
    /**
     * Number indicating offset from anchor point (top for vertical, left for horizontal) where the scroll handle
     * should be rendered.
     *
     * @property scrollTo
     * @public
     * @type Number
     */
    scrollTo: computed('vertical', {
      get: function get() {
        return this.get('vertical') ? this.get('scrollToY') : this.get('scrollToX');
      },
      set: function set(key, value) {
        // TODO this is deprecated. remove eventually.
        deprecate('Using the `scrollTo` property directly has been deprecated, please prefer being explicit by using `scrollToX` and `scrollToY`.');
        var prop = this.get('vertical') ? 'scrollToY' : 'scrollToX';
        this.set(prop, value);
        return value;
      }
    }),

    /**
     * Position in pixels for which to scroll horizontal scrollbar.
     *
     * @property scrollToX
     * @public
     * @type Number
     */
    scrollToX: 0,
    /**
     * Position in pixels for which to scroll vertical scrollbar.
     *
     * @property scrollToY
     * @public
     * @type Number
     */
    scrollToY: 0,

    /**
     * Callback when the content is scrolled horizontally.
     *
     * @method onScrollX
     * @public
     * @type Function
     */
    onScrollX: function onScrollX() {},

    /**
     * Callback when the content is scrolled vertically.
     *
     * @method onScrollY
     * @public
     * @type Function
     */
    onScrollY: function onScrollY() {},

    /**
     * Local reference the horizontal scrollbar.
     *
     * @property horizontalScrollbar
     * @private
     */
    horizontalScrollbar: null,
    /**
     * Local reference the vertical scrollbar.
     *
     * @property verticalScrollbar
     * @private
     */
    verticalScrollbar: null,

    scrollbarThickness: service(),

    didReceiveAttrs: function didReceiveAttrs() {
      var horizontal = this.get('horizontal');
      var vertical = this.get('horizontal');
      // Keep backwards compatible functionality wherein vertical is default when neither vertical or horizontal are explicitly set
      if (!horizontal && !isPresent(vertical)) {
        this.set('vertical', true);
      }
    },

    didInsertElement: function didInsertElement() {
      var _this = this;

      this._super.apply(this, arguments);
      this.setupElements();
      scheduleOnce('afterRender', this, this.createScrollbarAndShowIfNecessary);
      this.addEventListener(window, 'mouseup', function (e) {
        return _this.endDrag(e);
      });
      this.setupResize();
    },

    willDestroyElement: function willDestroyElement() {
      this._super.apply(this, arguments);

      this.$().off('transitionend webkitTransitionEnd', this._resizeHandler);
    },

    /**
     * Inidcates that the horizontal scrollbar is dragging at this moment in time.
     * @property isHorizontalDragging
     * @private
     */
    isHorizontalDragging: false,
    /**
     * Inidcates that the vertical scrollbar is dragging at this moment in time.
     * @property isVerticalDragging
     * @private
     */
    isVerticalDragging: false,
    /**
     * Size in pixels of the handle within the horizontal scrollbar.
     * Determined by a ration between the scroll content and the scroll viewport
     *
     * @property horizontalHandleSize
     * @private
     */
    horizontalHandleSize: null,
    /**
     * Size in pixels of the handle within the vertical scrollbar.
     * Determined by a ration between the scroll content and the scroll viewport
     *
     * @property verticalHandleSize
     * @private
     */
    verticalHandleSize: null,
    /**
     * Amount in pixels offset from the anchor (leftmost point of horizontal scrollbar)
     *
     * @property horizontalHandleOffset
     * @private
     */
    horizontalHandleOffset: 0,
    /**
     * Amount in pixels offset from the anchor (topmost point of vertical scrollbar)
     *
     * @property verticalHandleOffest
     * @private
     */
    verticalHandleOffest: 0,
    /**
     *
     * @property dragOffset
     * @private
     */
    dragOffset: 0,

    contentSize: function contentSize(sizeAttr) {
      return this._contentElement[sizeAttr]();
    },

    setupElements: function setupElements() {
      this._contentElement = this.$(contentSelector + ':first');
    },

    /**
     * Used to create/reset scrollbar(s) if they are necessary
     *
     * @method createScrollbarAndShowIfNecessary
     */
    createScrollbarAndShowIfNecessary: function createScrollbarAndShowIfNecessary() {
      var _this2 = this;

      this.createScrollbar().map(function (scrollbar) {
        _this2.checkScrolledToBottom(scrollbar);
        if (scrollbar.isNecessary) {
          _this2.showScrollbar();
        }
      });
    },

    _resizeHandler: function _resizeHandler() {
      debounce(this, this.resizeScrollbar, 16);
    },

    setupResize: function setupResize() {
      this.addEventListener(window, 'resize', this._resizeHandler, true);
    },

    resizeScrollContent: function resizeScrollContent() {
      var width = this.$().width();
      var height = this.$().height();
      var scrollbarThickness = this.get('scrollbarThickness.thickness');

      var hasHorizontal = this.get('horizontal');
      var hasVertical = this.get('vertical');

      if (hasHorizontal && hasVertical) {
        this.set('scrollContentWidth', width + scrollbarThickness);
        this.set('scrollContentHeight', height + scrollbarThickness);
      } else if (hasHorizontal) {
        this.set('scrollContentWidth', width);
        this.set('scrollContentHeight', height + scrollbarThickness);
        this._contentElement.height(height);
      } else {
        this.set('scrollContentWidth', width + scrollbarThickness);
        this.set('scrollContentHeight', height);
      }
    },

    /**
     * Creates the corresponding scrollbar(s) from the configured `vertical` and `horizontal` properties
     *
     * @method createScrollbar
     * @return {Array} Scrollbar(s) that were created
     */
    createScrollbar: function createScrollbar() {
      if (this.get('isDestroyed')) {
        return [];
      }
      var scrollbars = [];

      this.resizeScrollContent();

      if (this.get('vertical')) {
        var verticalScrollbar = new _emberScrollableClassesScrollable.Vertical({
          scrollbarElement: this.$(scrollbarSelector + '.vertical'),
          contentElement: this._contentElement
        });
        this.set('verticalScrollbar', verticalScrollbar);
        this.updateScrollbarAndSetupProperties(0, 'vertical');
        scrollbars.push(verticalScrollbar);
      }
      if (this.get('horizontal')) {
        var horizontalScrollbar = new _emberScrollableClassesScrollable.Horizontal({
          scrollbarElement: this.$(scrollbarSelector + '.horizontal'),
          contentElement: this._contentElement
        });
        this.set('horizontalScrollbar', horizontalScrollbar);
        this.updateScrollbarAndSetupProperties(0, 'horizontal');
        scrollbars.push(horizontalScrollbar);
      }
      return scrollbars;
    },

    /**
     * Show the scrollbar(s) when the user moves within the scroll viewport
     *
     * @method mouseMove
     * @private
     */
    mouseMove: function mouseMove() {
      if (this.get('autoHide')) {
        throttle(this, this.showScrollbar, THROTTLE_TIME_LESS_THAN_60_FPS_IN_MS);
      }
    },

    /**
     * Called on mouse up to indicate dragging is over.
     *
     * @method endDrag
     * @param e
     * @private
     */

    endDrag: function endDrag(e) {
      /* jshint unused:vars */
      this.set('isVerticalDragging', false);
      this.set('isHorizontalDragging', false);
    },

    /**
     * Calculates and setups the correct handle position using the scrollbar offset and size
     *
     * @method updateScrollbarAndSetupProperties
     * @param scrollOffset
     * @param scrollbarDirection
     * @private
     */
    updateScrollbarAndSetupProperties: function updateScrollbarAndSetupProperties(scrollOffset, scrollbarDirection) {
      var _get$getHandlePositionAndSize = this.get(scrollbarDirection + 'Scrollbar').getHandlePositionAndSize(scrollOffset);

      var handleOffset = _get$getHandlePositionAndSize.handleOffset;
      var handleSize = _get$getHandlePositionAndSize.handleSize;

      this.set(scrollbarDirection + 'HandleOffset', handleOffset);
      this.set(scrollbarDirection + 'HandleSize', handleSize);
    },

    /**
     * Callback for the scroll event emitted by the container of the content that can scroll.
     * Here we update the scrollbar to reflect the scrolled position.
     *
     * @method scrolled
     * @param event
     * @param scrollOffset
     * @param scrollDirection 'vertical' or 'horizontal'
     * @private
     */
    scrolled: function scrolled(event, scrollOffset, scrollDirection) {
      this.updateScrollbarAndSetupProperties(scrollOffset, scrollDirection);
      this.showScrollbar();

      this.checkScrolledToBottom(this.get(scrollDirection + 'Scrollbar'), scrollOffset);
      var direction = scrollDirection === 'vertical' ? 'Y' : 'X';
      this.get('onScroll' + direction)(scrollOffset);
      // synchronize scrollToX / scrollToY
      this.set('scrollTo' + direction, scrollOffset);
      // TODO this is deprecated. remove eventually.
      this.sendScroll(event, scrollOffset);
    },

    checkScrolledToBottom: function checkScrolledToBottom(scrollbar, scrollOffset) {
      var scrollBuffer = this.get('scrollBuffer');

      if (scrollbar.isScrolledToBottom(scrollBuffer, scrollOffset)) {
        debounce(this, this.sendScrolledToBottom, 100);
      }
    },

    sendScrolledToBottom: function sendScrolledToBottom() {
      this.sendAction('onScrolledToBottom');
    },

    sendScroll: function sendScroll(event, scrollOffset) {
      if (this.get('onScroll')) {
        deprecate('Using the `onScroll` callback has deprecated in favor of the explicit `onScrollX` and `onScrollY callbacks');
        this.sendAction('onScroll', scrollOffset, event);
      }
    },

    resizeScrollbar: function resizeScrollbar() {
      this.createScrollbarAndShowIfNecessary();
    },

    showScrollbar: function showScrollbar() {
      if (this.get('isDestroyed')) {
        return;
      }
      this.set('showHandle', true);

      if (!this.get('autoHide')) {
        return;
      }

      debounce(this, this.hideScrollbar, hideDelay);
    },

    hideScrollbar: function hideScrollbar() {
      if (this.get('isDestroyed')) {
        return;
      }
      this.set('showHandle', false);
    },

    /**
     * Sets scrollTo{X,Y} by using the ratio of offset to content size.
     * Called when the handle in ember-scrollbar is dragged.
     *
     * @method updateScrollToProperty
     * @param scrollProp {String} String indicating the scrollTo attribute to be updated ('scrollToX'|'scrollToY')
     * @param dragPerc {Number} A Number from 0 - 1 indicating the position of the handle as percentage of the scrollbar
     * @param sizeAttr {String} String indicating the attribute used to get to the size of the content ('height'|'width')
     * @private
     */
    updateScrollToProperty: function updateScrollToProperty(scrollProp, dragPerc, sizeAttr) {
      var srcollTo = dragPerc * this.contentSize(sizeAttr);
      this.set(scrollProp, srcollTo);
    },

    /**
     * Sets is{Horizontal,Vertical}Dragging to true or false when the handle starts or ends dragging
     *
     * @method toggleDraggingBoundary
     * @param isDraggingProp 'isHorizontalDragging' or 'isVerticalDragging'
     * @param startOrEnd true if starting to drag, false if ending
     * @private
     */
    toggleDraggingBoundary: function toggleDraggingBoundary(isDraggingProp, startOrEnd) {
      this.set(isDraggingProp, startOrEnd);
    },

    /**
     * Jumps a page because user clicked on scroll bar not scroll bar handle.
     *
     * @method jumpScroll
     * @param jumpPositive if true the user clicked between the handle and the end, if false, the user clicked between the
     *  anchor and the handle
     * @param scrollToProp 'scrollToX' or 'scrollToY'
     * @param sizeAttr 'width' or 'height'
     * @private
     */
    jumpScroll: function jumpScroll(jumpPositive, scrollToProp, sizeAttr) {
      var scrollOffset = this.get(scrollToProp);
      var jumpAmt = PAGE_JUMP_MULTIPLE * this.contentSize(sizeAttr);
      var scrollPos = jumpPositive ? scrollOffset - jumpAmt : scrollOffset + jumpAmt;
      this.set(scrollToProp, scrollPos);
    },

    actions: {

      /**
       * Update action should be called when size of the scroll area changes
       */
      recalculate: function recalculate() {
        // TODO this is effectively the same as `update`, except for update returns the passed in value. Keep one, and rename `resizeScrollbar` to be clear.
        this.resizeScrollbar();
      },

      /**
       * Can be called when scrollbars change as a result of value change,
       *
       * for example
       * ```
       * {{#as-scrollable as |scrollbar|}}
       *   {{#each (compute scrollbar.update rows) as |row|}}
       *     {{row.title}}
       *   {{/each}}
       * {{/as-scrollable}}
       * ```
       */
      update: function update(value) {
        scheduleOnce('afterRender', this, this.resizeScrollbar);
        return value;
      },

      /**
       * Scroll Top action should be called when when the scroll area should be scrolled top manually
       */
      scrollTop: function scrollTop() {
        // TODO some might expect the `scrollToY` action to be called here
        this.set('scrollToY', 0);
      },
      scrolled: function scrolled() {
        scheduleOnce.apply(undefined, ['afterRender', this, 'scrolled'].concat(_slice.call(arguments)));
      },
      horizontalDrag: function horizontalDrag(dragPerc) {
        scheduleOnce('afterRender', this, 'updateScrollToProperty', 'scrollToX', dragPerc, 'width');
      },
      verticalDrag: function verticalDrag(dragPerc) {
        scheduleOnce('afterRender', this, 'updateScrollToProperty', 'scrollToY', dragPerc, 'height');
      },
      horizontalJumpTo: function horizontalJumpTo(jumpPositive) {
        this.jumpScroll(jumpPositive, 'scrollToX', 'width');
      },
      verticalJumpTo: function verticalJumpTo(jumpPositive) {
        this.jumpScroll(jumpPositive, 'scrollToY', 'height');
      },
      horizontalDragBoundary: function horizontalDragBoundary(isStart) {
        this.toggleDraggingBoundary('isHorizontalDragging', isStart);
      },
      verticalBoundaryEvent: function verticalBoundaryEvent(isStart) {
        this.toggleDraggingBoundary('isVerticalDragging', isStart);
      }
    }
  });
});