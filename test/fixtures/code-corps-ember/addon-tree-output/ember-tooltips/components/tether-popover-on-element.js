define('ember-tooltips/components/tether-popover-on-element', ['exports', 'ember-tooltips/components/tether-tooltip-and-popover', 'ember-tooltips/templates/components/tether-popover'], function (exports, _tetherTooltipAndPopover, _tetherPopover) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.isElementInPopover = isElementInPopover;
  exports.isElementInTargetAndNotInPopover = isElementInTargetAndNotInPopover;
  exports.isElementElsewhere = isElementElsewhere;
  var $ = Ember.$,
      run = Ember.run;


  /* These isElement________ functions are used to determine where an element
  is in relation to the $popover and the $target elements. This is needed to
  handle the visible state when a user interacts with any of these elements.
  */

  /**
   * Determines if element is $popover or contained within $popover
   *
   * @method isElementInPopover
   * @param {DOM element} element
   * @param {jQuery element} $popover
   * @return {boolean}
   * @public
   */

  function isElementInPopover(element, $popover) {
    if (!$popover) {
      return false;
    }

    return $popover.is(element) || !!$popover.find(element).length;
  }

  /**
   * Determines if the element is $target or (in $target and not
   * contained within $popover)
   *
   * @method isElementInTargetAndNotInPopover
   * @param {DOM element} element
   * @param {jQuery element} $target
   * @param {jQuery element} $popover
   * @return {boolean}
   * @public
   */

  function isElementInTargetAndNotInPopover(element, $target, $popover) {
    if (!$target || !$popover) {
      return false;
    }

    if ($target.is(element)) {
      return true;
    }

    return !!$target.find(element).length && !isElementInPopover(element, $popover);
  }

  /**
   * Determines if element is not $popover, not $target, and
   * not contained within either.
   *
   * @method isElementElsewhere
   * @param {DOM element} element
   * @param {jQuery element} $target
   * @param {jQuery element} $popover
   * @return {boolean}
   * @public
   */

  function isElementElsewhere(element, $target, $popover) {
    var isElementOutsidePopover = !isElementInPopover(element, $popover);
    var isElementOutsideTarget = !isElementInTargetAndNotInPopover(element, $target, $popover);

    return isElementOutsideTarget && isElementOutsidePopover;
  }

  exports.default = _tetherTooltipAndPopover.default.extend({

    /* Options */

    hideDelay: 250,

    /* Properties */

    classNames: ['ember-popover'],
    layout: _tetherPopover.default,

    _isMouseInside: false,

    didRender: function didRender() {

      /* The lazy-render popover component instance needs
      access to the childView so that it can call the
      childView's hide action.
      */

      this._super.apply(this, arguments);

      var parentView = this.get('parentView');

      if (parentView) {
        parentView.set('_childView', this);
      }
    },
    didInsertElement: function didInsertElement() {
      var _this = this;

      this._super.apply(this, arguments);

      var event = this.get('event');
      var target = this.get('target');
      var $target = $(target);
      var $popover = this.$();

      if (event === 'none') {

        return;
      } else if (event === 'hover') {

        var _showOn = this.get('_showOn');
        var _hideOn = this.get('_hideOn');

        $target.on(_showOn, function () {
          return _this.show();
        });

        $target.add($popover).on(_hideOn, function () {
          _this.set('_isMouseInside', false);

          var hideDelay = +_this.get('hideDelay');
          var hideIfOutside = function hideIfOutside() {
            if (!_this.get('_isMouseInside')) {
              _this.hide();
            }
          };

          if (hideDelay) {
            run.later(function () {
              hideIfOutside();
            }, hideDelay);
          } else {
            hideIfOutside();
          }
        });

        /* We must use mouseover because it correctly
        registers hover interactivity when spacing='0'
        */

        $target.add($popover).on('mouseover', function () {
          return _this.set('_isMouseInside', true);
        });
      } else if (event === 'click') {

        $(document).on('click.' + target, function (event) {

          /* This lightweight, name-spaced click handler is
          necessary to determine where a click occurs
           https://css-tricks.com/dangers-stopping-event-propagation/
          */

          var isClickedElementElsewhere = isElementElsewhere(event.target, $target, $popover);
          var isClickedElementInTarget = isElementInTargetAndNotInPopover(event.target, $target, $popover);
          var isClickedElementInPopover = isElementInPopover(event.target, $popover);
          var isPopoverShown = _this.get('isShown');

          if (isClickedElementElsewhere && isPopoverShown) {

            /* The clickedElement is elsewhere and the popover
            should hide() */

            _this.hide();
          } else if (!isClickedElementInPopover && isClickedElementInTarget) {

            /* See notes in the .on('focus') */

            if (_this.get('_isInProcessOfShowing')) {
              _this.set('_isInProcessOfShowing', false);
            } else {
              _this.toggle();
            }
          }
        });
      }

      $target.on('focus', function () {

        /* The focus event occurs before the click event.
        when this happens we don't want to call focus then click.
        _isInProcessOfShowing prevents that from happening.
        */

        _this.set('_isInProcessOfShowing', true);
        _this.show();
      });

      $target.add($popover).on('focusout', function () {

        /* Use a run.later() to allow the 'focusout' event
        to finish handling.
        */

        run.later(function () {
          var isFocusedElementElsewhere = isElementElsewhere(document.activeElement, $target, $popover);

          if (isFocusedElementElsewhere) {
            _this.hide();
          }
        });
      });
    },
    willDestroyElement: function willDestroyElement() {
      this._super.apply(this, arguments);

      var target = this.get('target');
      var $target = $(target);
      var $popover = this.$();
      var _showOn = this.get('_showOn');
      var _hideOn = this.get('_hideOn');

      $target.add($popover).off(_showOn + ' mouseover ' + _hideOn + ' focus focusout');

      $(document).off('click.' + target);
    },

    actions: {
      hide: function hide() {
        this.hide();
      }
    }
  });
});