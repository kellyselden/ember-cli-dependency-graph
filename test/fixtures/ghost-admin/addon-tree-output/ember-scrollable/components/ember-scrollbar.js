define('ember-scrollable/components/ember-scrollbar', ['exports', 'ember', 'ember-lifeline/mixins/dom', 'ember-scrollable/templates/components/ember-scrollbar', 'ember-scrollable/util/css', 'ember-scrollable/components/ember-scrollable'], function (exports, _ember, _emberLifelineMixinsDom, _emberScrollableTemplatesComponentsEmberScrollbar, _emberScrollableUtilCss, _emberScrollableComponentsEmberScrollable) {
  var computed = _ember['default'].computed;
  var isPresent = _ember['default'].isPresent;
  var throttle = _ember['default'].run.throttle;

  var handleSelector = '.drag-handle';

  /**
   * Handles displaying and moving the handle within the confines of it's template.
   * Has callbacks for intending to dragging and jump to particular positions.
   *
   * @class EmberScrollbar
   * @extends Ember.Component
   */
  exports['default'] = _ember['default'].Component.extend(_emberLifelineMixinsDom['default'], {
    layout: _emberScrollableTemplatesComponentsEmberScrollbar['default'],
    classNameBindings: [':tse-scrollbar', 'horizontal:horizontal:vertical'],
    onDrag: function onDrag() {},
    onJumpTo: function onJumpTo() {},
    onDragStart: function onDragStart() {},
    onDragEnd: function onDragEnd() {},

    horizontal: false,
    isDragging: false,
    showHandle: false,
    handleSize: null,
    handleOffset: 0,
    mouseOffset: 0,

    offsetAttr: computed('horizontal', function () {
      return this.get('horizontal') ? 'left' : 'top';
    }),

    jumpScrollOffsetAttr: computed('horizontal', function () {
      return this.get('horizontal') ? 'offsetX' : 'offsetY';
    }),

    eventOffsetAttr: computed('horizontal', function () {
      return this.get('horizontal') ? 'pageX' : 'pageY';
    }),

    sizeAttr: computed('horizontal', function () {
      return this.get('horizontal') ? 'width' : 'height';
    }),

    handleStylesJSON: computed('handleOffset', 'handleSize', 'horizontal', function () {
      var _getProperties = this.getProperties('handleOffset', 'handleSize');

      var handleOffset = _getProperties.handleOffset;
      var handleSize = _getProperties.handleSize;

      if (this.get('horizontal')) {
        return { left: handleOffset + 'px', width: handleSize + 'px' };
      } else {
        return { top: handleOffset + 'px', height: handleSize + 'px' };
      }
    }),

    handleStyles: computed('handleStylesJSON.{top,left,width,height}', function () {
      return (0, _emberScrollableUtilCss.styleify)(this.get('handleStylesJSON'));
    }),

    mouseDown: function mouseDown(e) {
      this.jumpScroll(e);
    },

    startDrag: function startDrag(e) {
      // Preventing the event's default action stops text being
      // selectable during the drag.
      e.preventDefault();
      e.stopPropagation();

      var dragOffset = this._startDrag(e);
      this.set('dragOffset', dragOffset);
      this.get('onDragStart')(e);
    },

    mouseUp: function mouseUp() {
      this.endDrag();
    },

    didReceiveAttrs: function didReceiveAttrs() {
      var mouseOffset = this.get('mouseOffset');
      if (this.get('isDragging')) {
        if (isPresent(mouseOffset)) {
          this._drag(mouseOffset, this.get('dragOffset'));
        }
      }
    },

    didInsertElement: function didInsertElement() {
      var _this = this;

      this._super.apply(this, arguments);
      this.addEventListener(window, 'mousemove', function (e) {
        throttle(_this, _this.updateMouseOffset, e, _emberScrollableComponentsEmberScrollable.THROTTLE_TIME_LESS_THAN_60_FPS_IN_MS);
      });
    },

    endDrag: function endDrag() {
      this.get('onDragEnd')();
    },

    /**
     * Callback for the mouse move event. Update the mouse offsets given the new mouse position.
     *
     * @method updateMouseOffset
     * @param e
     * @private
     */
    updateMouseOffset: function updateMouseOffset(e) {
      var pageX = e.pageX;
      var pageY = e.pageY;

      this.set('mouseOffset', this.get('horizontal') ? pageX : pageY);
    },

    /**
     * Handles when user clicks on scrollbar, but not on the actual handle, and the scroll should
     * jump to the selected position.
     *
     * @method jumpScroll
     * @param e
     */
    jumpScroll: function jumpScroll(e) {
      // If the drag handle element was pressed, don't do anything here.
      if (e.target === this.$(handleSelector)[0]) {
        return;
      }
      this._jumpScroll(e);
    },

    // private methods
    /**
     * Convert the mouse position into a percentage of the scrollbar height/width.
     * and sends to parent
     *
     * @param eventOffset
     * @param dragOffset
     * @private
     */
    _drag: function _drag(eventOffset, dragOffset) {
      var scrollbarOffset = this._scrollbarOffset();
      var dragPos = eventOffset - scrollbarOffset - dragOffset;
      // Convert the mouse position into a percentage of the scrollbar height/width.
      var dragPerc = dragPos / this._scrollbarSize();
      this.get('onDrag')(dragPerc);
    },

    /**
     * Calls `onJumpTo` action with a boolean indicating the direction of the jump, and the jQuery MouseDown event.
     *
     * If towardsAnchor is true, the jump is in a direction towards from the initial anchored position of the scrollbar.
     *  i.e. for a vertical scrollbar, towardsAnchor=true indicates moving upwards, and towardsAnchor=false is downwards
     *       for a horizontal scrollbar, towardsAnchor=true indicates moving left, and towardsAnchor=false is right
     *
     * @param e
     * @private
     */
    _jumpScroll: function _jumpScroll(e) {
      var eventOffset = this._jumpScrollEventOffset(e);
      var handleOffset = this._handlePositionOffset();
      var towardsAnchor = eventOffset < handleOffset;

      this.get('onJumpTo')(towardsAnchor, e);
    },

    _startDrag: function _startDrag(e) {
      return this._eventOffset(e) - this._handleOffset();
    },

    _handleOffset: function _handleOffset() {
      return this.$(handleSelector).offset()[this.get('offsetAttr')];
    },

    _handlePositionOffset: function _handlePositionOffset() {
      return this.$(handleSelector).position()[this.get('offsetAttr')];
    },

    _scrollbarOffset: function _scrollbarOffset() {
      return this.$().offset()[this.get('offsetAttr')];
    },

    /**
     * Returns the offset from the anchor point derived from this MouseEvent
     * @param e MouseEvent
     * @return {Number}
     */
    _jumpScrollEventOffset: function _jumpScrollEventOffset(e) {
      return e[this.get('jumpScrollOffsetAttr')];
    },

    _eventOffset: function _eventOffset(e) {
      return e[this.get('eventOffsetAttr')];
    },

    _scrollbarSize: function _scrollbarSize() {
      return this.$()[this.get('sizeAttr')]();
    },

    actions: {
      startDrag: function startDrag() {
        this.startDrag.apply(this, arguments);
      }
    }
  });
});