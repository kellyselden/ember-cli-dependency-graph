define('ember-tooltips/components/tether-tooltip-and-popover', ['exports', 'ember-tether/components/ember-tether'], function (exports, _emberTether) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var $ = Ember.$,
      assert = Ember.assert,
      computed = Ember.computed,
      observer = Ember.observer,
      on = Ember.on,
      run = Ember.run;


  var defaultPosition = 'center';

  var tooltipOrPopoverCounterId = 0;

  function cleanNumber(stringOrNumber) {
    var cleanNumber = void 0;

    if (stringOrNumber && typeof stringOrNumber === 'string') {
      cleanNumber = parseInt(stringOrNumber, 10);

      /* Remove invalid parseInt results */

      if (isNaN(cleanNumber) || !isFinite(cleanNumber)) {
        cleanNumber = 0;
      }
    } else {
      cleanNumber = stringOrNumber;
    }

    return cleanNumber;
  }

  exports.default = _emberTether.default.extend({

    passedPropertiesObject: null,
    setPropertiesWithPassedPropertiesObject: on('didReceiveAttrs', function () {
      this._super.apply(this, arguments);

      var passedPropertiesObject = this.get('passedPropertiesObject');

      if (passedPropertiesObject) {
        this.setProperties(passedPropertiesObject);
      }
    }),

    /* Options */

    delay: 0,
    delayOnChange: true,
    duration: 0,
    effect: 'slide', // Options: fade, slide, none
    event: 'hover', // Options: hover, click, focus, none
    hideOn: null,
    role: 'tooltip',
    side: 'top',
    showOn: null,
    spacing: 10,
    tabindex: '0', // A positive integer (to enable) or -1 (to disable)
    isShown: false,
    tooltipIsVisible: computed.deprecatingAlias('isShown', {
      id: 'tooltip-and-popover.tooltipIsVisible',
      until: '3.0.0'
    }),
    keepInWindow: true,

    /**
    When this property changes it repositions the tooltip.
     This isn't actually used in the code anywhere - it just
    needs to be passed as an attribute so didUpdate is
    triggered.
     @property updateFor
    @public
    */

    updateFor: null,

    /* Actions */

    onDestroy: null,
    onHide: null,
    onRender: null,
    onShow: null,

    onTooltipDestroy: computed.deprecatingAlias('onDestroy', {
      id: 'tooltip-and-popover.onTooltipDestroy',
      until: '3.0.0'
    }),
    onTooltipHide: computed.deprecatingAlias('onHide', {
      id: 'tooltip-and-popover.onTooltipHide',
      until: '3.0.0'
    }),
    onTooltipRender: computed.deprecatingAlias('onRender', {
      id: 'tooltip-and-popover.onTooltipRender',
      until: '3.0.0'
    }),
    onTooltipShow: computed.deprecatingAlias('onShow', {
      id: 'tooltip-and-popover.onTooltipShow',
      until: '3.0.0'
    }),

    /* Properties */

    attributeBindings: ['role', 'tabindex'],
    classNameBindings: ['effectClass'],
    classPrefix: 'ember-tooltip-or-popover',

    _didUpdateTimeoutLength: 1000, // 1000 ms or 0 ms, depending whether in test mode
    _hideTimer: null,
    _showTimer: null,
    _isTetherEnabled: true,

    /* CPs */

    /**
     * The attributeBindings are handled asynchronously
     *
     * http://stackoverflow.com/a/18731021/3304337
     *
     * This observer makes it sync, which makes testing
     * more consistent.
     *
     * @method dataTetherEnabledHandler
     * @public
     */

    dataTetherEnabledHandler: observer('_isTetherEnabled', function () {
      var tetherEnabledString = this.get('_isTetherEnabled') ? 'true' : 'false';
      var $element = this.$();

      if ($element && $element.attr) {
        $element.attr('data-tether-enabled', tetherEnabledString);
      }
    }),

    ariaHiddenHandler: observer('isShown', function () {
      var ariaHiddenString = this.get('isShown') ? 'false' : 'true';
      var $element = this.$();

      if ($element && $element.attr) {
        $element.attr('aria-hidden', ariaHiddenString);
      }
    }),

    attachment: computed(function () {
      var side = this.get('side');

      var horizontalPosition = void 0;
      var verticalPosition = void 0;

      switch (side) {
        case 'top':
          horizontalPosition = defaultPosition;
          verticalPosition = 'bottom';
          break;
        case 'right':
          horizontalPosition = 'left';
          verticalPosition = defaultPosition;
          break;
        case 'bottom':
          horizontalPosition = defaultPosition;
          verticalPosition = 'top';
          break;
        case 'left':
          horizontalPosition = 'right';
          verticalPosition = defaultPosition;
          break;
      }

      return verticalPosition + ' ' + horizontalPosition;
    }),

    constraints: computed('keepInWindow', function () {
      var constraints = void 0;

      if (this.get('keepInWindow')) {
        constraints = [{
          to: 'window',
          attachment: 'together'
        }];
      }

      return constraints;
    }),

    effectClass: computed(function () {
      return this.get('classPrefix') + '-' + this.get('effect');
    }),

    positionClass: computed(function () {
      var targetAttachment = this.get('targetAttachment');
      var classPrefix = this.get('classPrefix');

      return classPrefix + '-' + targetAttachment.replace(' ', ' ' + classPrefix + '-');
    }),

    sideIsVertical: computed(function () {
      var side = this.get('side');

      return side === 'top' || side === 'bottom';
    }),

    target: computed(function () {
      var $element = this.$();

      /* It's not possible to access the DOM when
      running in Fastboot
      */

      if (!$element) {
        return null;
      }

      var parentElement = $element.parent();
      var parentElementId = parentElement && parentElement.attr('id');

      if (!parentElementId) {
        parentElementId = 'target-for-tooltip-or-popover-' + tooltipOrPopoverCounterId;

        tooltipOrPopoverCounterId++;

        parentElement.attr('id', parentElementId);
      }

      return '#' + parentElementId;
    }),

    targetAttachment: computed(function () {
      var side = this.get('side');

      if (!this.get('sideIsVertical')) {
        return 'center ' + side;
      } else {
        return side + ' center';
      }
    }),

    typeClass: computed(function () {
      var type = this.get('type');
      var classPrefix = this.get('classPrefix');

      return type ? classPrefix + '-' + type : null;
    }),

    /* Private CPs */

    _hideOn: computed(function () {
      var hideOn = this.get('hideOn');

      if (!hideOn) {
        var event = this.get('event');

        switch (event) {
          case 'hover':
            hideOn = 'mouseleave';
            break;
          case 'focus':
            hideOn = 'blur';
            break;
          case 'ready':
            hideOn = null;
            break;
          default:
            hideOn = event;
            break;
        }
      }

      return hideOn;
    }),

    _showOn: computed(function () {
      var showOn = this.get('showOn');

      if (!showOn) {
        var event = this.get('event');

        switch (event) {
          case 'hover':
            showOn = 'mouseenter';
            break;
          default:
            showOn = event;
            break;
        }
      }

      return showOn;
    }),

    /* Methods */

    hide: function hide() {

      if (this.get('isDestroying')) {
        return;
      }

      /* If the tooltip is about to be showed by
      a delay, stop is being shown. */

      run.cancel(this.get('_showTimer'));

      this.set('isShown', false);

      this.sendAction('onHide', this);

      this.stopTether();
    },
    didInsertElement: function didInsertElement() {
      var _this = this;

      this._super.apply(this, arguments);

      if (this.get('_shouldShowOnRender')) {
        this.show();
      }

      var target = this.get('target');

      if (!target || target.indexOf('#') === -1) {
        assert('You must specify a target attribute in the format target="#element-id" for the tooltip component');
      }

      var $target = $(this.get('target'));
      var _tether = this.get('_tether');
      var $tether = $(_tether.element);

      this.sendAction('onRender', this);

      $target.attr({
        'aria-describedby': '' + this.get('elementId'),
        tabindex: $target.attr('tabindex') || this.get('tabindex')
      });

      /* Needed so that these 'aria-hidden' and
      'data-tether-enabled' don't init to undefined
      */

      this.ariaHiddenHandler();
      this.dataTetherEnabledHandler();

      /* When this component has rendered we need
      to check if Tether moved its position to keep the
      element in bounds */

      var renderedSide = void 0;

      ['top', 'right', 'bottom', 'left'].forEach(function (side) {
        if ($tether.hasClass(_this.get('classPrefix') + '-target-attached-' + side)) {
          renderedSide = side;
        }
      });

      /* We then use the side the tooltip was *actually*
      rendered on to set the correct offset from
      the target element */

      var spacing = this.get('spacing');

      var offset = void 0;

      switch (renderedSide) {
        case 'top':
          offset = spacing + 'px 0';
          break;
        case 'right':
          offset = '0 -' + spacing + 'px';
          break;
        case 'bottom':
          offset = '-' + spacing + 'px 0';
          break;
        case 'left':
          offset = '0 ' + spacing + 'px';
          break;
      }

      this.set('offset', offset);

      if (!this.get('isShown')) {
        this.stopTether();
      }
    },


    /*
    Repositions the tooltip if new attributes or content are
    passed to the tooltip.
     @method didUpdate
    */

    didUpdate: function didUpdate() {
      var _this2 = this;

      this._super.apply(this, arguments);

      run.later(function () {
        _this2.positionTether();
        _this2.sendAction('onRender', _this2);
      }, this.get('_didUpdateTimeoutLength'));
    },


    /*
    We use an observer so the user can set isShown
    as a attribute.
     @method setTimer
    */

    setTimer: observer('isShown', function () {
      var isShown = this.get('isShown');

      if (isShown) {
        this.startTether();
        var duration = cleanNumber(this.get('duration'));

        run.cancel(this.get('_hideTimer'));

        if (duration) {

          /* Hide tooltip after specified duration */

          var hideTimer = run.later(this, this.hide, duration);

          /* Save timer ID for canceling should an event
          hide the tooltip before the duration */

          this.set('_hideTimer', hideTimer);
        }
      } else {
        this.stopTether();
      }
    }),

    show: function show() {
      var _this3 = this;

      /* Calling this.positionTether() fixes the issues raised in
      https://github.com/sir-dunxalot/ember-tooltips/issues/75
      */

      this.positionTether();

      if (this.get('isDestroying')) {
        return;
      }

      var _showTimer = this.get('_showTimer');

      var delay = cleanNumber(this.get('delay'));

      run.cancel(_showTimer);

      if (delay) {
        if (!this.get('delayOnChange')) {

          /* If the `delayOnChange` property is set to false, we
          don't want to delay opening this tooltip/popover if there is
          already a tooltip/popover shown in the DOM. Check that here
          and adjust the delay as needed. */

          var shownTooltipsOrPopovers = $('.' + this.get('classPrefix') + '-element[aria-hidden="false"]').length;

          if (shownTooltipsOrPopovers) {
            delay = 0;
          }
        }

        var _showTimer2 = run.later(this, function () {
          if (!_this3.get('destroying') && !_this3.get('isDestroyed')) {
            _this3.startTether();
            _this3.set('isShown', true);
          }
        }, delay);

        this.set('_showTimer', _showTimer2);
      } else {

        /* If there is no delay, show the tooltip immediately */

        this.startTether();
        this.set('isShown', true);
      }

      this.sendAction('onShow', this);
    },
    toggle: function toggle() {

      /* We don't use toggleProperty because we centralize
      logic for showing and hiding in the show() and hide()
      methods. */

      if (this.get('isShown')) {
        this.hide();
      } else {
        this.show();
      }
    },
    willDestroy: function willDestroy() {

      /* There's no jQuery when running in Fastboot */

      var $target = $ && $(this.get('target'));

      this.set('effect', null);
      this.hide();

      if ($target) {
        $target.removeAttr('aria-describedby');
        $target.off();
      }

      this._super.apply(this, arguments); // Removes tether

      this.sendAction('onDestroy', this);
    },
    startTether: function startTether() {

      /* We can't depend on `_tether.enabled` because
      it's not an Ember property (so won't trigger CP
      update when changed)
      */

      this.set('_isTetherEnabled', true);
      this.get('_tether').enable();
    },
    stopTether: function stopTether() {
      var _this4 = this;

      run.schedule('afterRender', function () {
        if (!_this4.isDestroyed && !_this4.isDestroying) {

          /* We can't depend on `_tether.enabled` because
          it's not an Ember property (so won't trigger CP
          update when changed)
          */

          _this4.set('_isTetherEnabled', false);
          _this4.get('_tether').disable();
        }
      });
    }
  });
});