define('ember-tooltips/components/tether-tooltip-on-element', ['exports', 'ember-tooltips/components/tether-tooltip-and-popover'], function (exports, _tetherTooltipAndPopover) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var $ = Ember.$;
  exports.default = _tetherTooltipAndPopover.default.extend({

    classNames: ['ember-tooltip'],
    didInsertElement: function didInsertElement() {
      var _this = this;

      this._super.apply(this, arguments);

      /* Setup event handling to hide and show the tooltip */

      var $target = $(this.get('target'));
      var event = this.get('event');

      /* Setup event handling to hide and show the tooltip */

      if (event !== 'none') {
        var _hideOn = this.get('_hideOn');
        var _showOn = this.get('_showOn');

        /* If show and hide are the same (e.g. click), toggle
        the visibility */

        if (_showOn === _hideOn) {
          $target.on(_showOn, function () {

            /* When using enableLazyRendering the focus event occurs before the click event.
            When this happens we don't want to call focus then click.
            _isInProcessOfShowing prevents that from happening. */

            if (_this.get('_isInProcessOfShowing')) {
              _this.set('_isInProcessOfShowing', false);
            } else {
              _this.toggle();
            }
          });
        } else {

          /* Else, add the show and hide events individually */

          if (_showOn !== 'none') {
            $target.on(_showOn, function () {
              _this.show();
            });
          }

          if (_hideOn !== 'none') {
            $target.on(_hideOn, function () {
              _this.hide();
            });
          }
        }

        /* Hide and show the tooltip on focus and escape
        for accessibility */

        if (event !== 'focus') {

          /* If the event is click, we don't want the
          click to also trigger focusin */

          if (event !== 'click') {
            $target.focusin(function () {
              _this.show();
            });
          }

          $target.focusout(function () {
            _this.hide();
          });
        }

        $target.keydown(function (keyEvent) {
          if (keyEvent.which === 27) {
            _this.hide();
            keyEvent.preventDefault();

            return false;
          }
        });
      }
    }
  });
});