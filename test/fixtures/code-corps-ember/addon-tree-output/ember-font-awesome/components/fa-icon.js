define('ember-font-awesome/components/fa-icon', ['exports', 'ember', 'ember-font-awesome/utils/try-match'], function (exports, _ember, _emberFontAwesomeUtilsTryMatch) {
  var computed = _ember['default'].computed;
  var get = _ember['default'].get;
  var isArray = _ember['default'].isArray;

  var FaIconComponent = _ember['default'].Component.extend({
    tagName: 'i',

    classNames: ['fa'],

    classNameBindings: ['iconCssClass', 'flipCssClass', 'rotateCssClass', 'sizeCssClass', 'pullCssClass', 'stackCssClass', 'spin:fa-spin', 'fixedWidth:fa-fw', 'listItem:fa-li', 'border:fa-border', 'pulse:fa-pulse', 'inverse:fa-inverse'],

    attributeBindings: ['ariaHiddenAttribute:aria-hidden', 'title', 'style'],

    style: computed('color', function () {
      var color = get(this, 'color');
      if (!color) {
        return;
      }
      return _ember['default'].String.htmlSafe('color:' + color);
    }),

    iconCssClass: computed('icon', 'params.[]', function () {
      var icon = get(this, 'icon');
      var params = get(this, 'params');

      icon = icon || isArray(params) && params[0];

      if (icon) {
        return (0, _emberFontAwesomeUtilsTryMatch['default'])(icon, /^fa-/) ? icon : 'fa-' + icon;
      }
    }),

    flipCssClass: computed('flip', function () {
      var flip = get(this, 'flip');
      if (!flip) {
        return;
      }
      return (0, _emberFontAwesomeUtilsTryMatch['default'])(flip, /^fa-flip/) ? flip : 'fa-flip-' + flip;
    }),

    rotateCssClass: computed('rotate', function () {
      var rotate = get(this, 'rotate');
      if (!rotate) {
        return;
      }

      if ((0, _emberFontAwesomeUtilsTryMatch['default'])(rotate, /^fa-rotate/)) {
        return rotate;
      } else {
        return 'fa-rotate-' + rotate;
      }
    }),

    sizeCssClass: computed('size', function () {
      var size = get(this, 'size');
      if (!size) {
        return;
      }

      if ((0, _emberFontAwesomeUtilsTryMatch['default'])(size, /^fa-/)) {
        return size;
      } else if ((0, _emberFontAwesomeUtilsTryMatch['default'])(size, /(?:lg|x)$/)) {
        return 'fa-' + size;
      } else {
        return 'fa-' + size + 'x';
      }
    }),

    pullCssClass: computed('pull', function () {
      var pull = get(this, 'pull');
      if (!pull) {
        return;
      }
      return 'fa-pull-' + pull;
    }),

    stackCssClass: computed('stack', function () {
      var stack = get(this, 'stack');
      if (!stack) {
        return;
      }

      if ((0, _emberFontAwesomeUtilsTryMatch['default'])(stack, /^fa-/)) {
        return stack;
      } else if ((0, _emberFontAwesomeUtilsTryMatch['default'])(stack, /x$/)) {
        return 'fa-stack-' + stack;
      } else {
        return 'fa-stack-' + stack + 'x';
      }
    }),

    ariaHiddenAttribute: computed('ariaHidden', function () {
      var ariaHidden = get(this, 'ariaHidden');
      return ariaHidden !== false ? 'true' : undefined;
    })
  });

  FaIconComponent.reopenClass({
    positionalParams: 'params'
  });

  exports['default'] = FaIconComponent;
});