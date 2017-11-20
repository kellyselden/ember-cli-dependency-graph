define('ember-light-table/components/lt-column-resizer', ['exports', 'ember', 'ember-light-table/templates/components/lt-column-resizer'], function (exports, _ember, _emberLightTableTemplatesComponentsLtColumnResizer) {
  var $ = _ember['default'].$;
  var computed = _ember['default'].computed;

  var TOP_LEVEL_CLASS = '.ember-light-table';

  exports['default'] = _ember['default'].Component.extend({
    layout: _emberLightTableTemplatesComponentsLtColumnResizer['default'],
    classNameBindings: [':lt-column-resizer', 'isResizing'],
    column: null,
    resizeOnDrag: false,

    isResizing: false,
    startWidth: null,
    startX: null,

    $column: computed(function () {
      return $(this.get('element')).parent('th');
    }).volatile().readOnly(),

    didInsertElement: function didInsertElement() {
      this._super.apply(this, arguments);

      this.__mouseMove = this._mouseMove.bind(this);
      this.__mouseUp = this._mouseUp.bind(this);

      $(document).on('mousemove', this.__mouseMove);
      $(document).on('mouseup', this.__mouseUp);
    },

    willDestroyElement: function willDestroyElement() {
      this._super.apply(this, arguments);

      $(document).off('mousemove', this.__mouseMove);
      $(document).off('mouseup', this.__mouseUp);
    },

    click: function click(e) {
      /*
        Prevent click events from propagating (i.e. onColumnClick)
       */
      e.preventDefault();
      e.stopPropagation();
    },

    mouseDown: function mouseDown(e) {
      var $column = this.get('$column');

      e.preventDefault();
      e.stopPropagation();

      this.setProperties({
        isResizing: true,
        startWidth: $column.outerWidth(),
        startX: e.pageX
      });

      this.$().closest(TOP_LEVEL_CLASS).addClass('is-resizing');
    },

    _mouseUp: function _mouseUp(e) {
      if (this.get('isResizing')) {
        e.preventDefault();
        e.stopPropagation();

        var $column = this.get('$column');
        var width = $column.outerWidth() + 'px';

        this.set('isResizing', false);
        this.set('column.width', width);

        this.sendAction('onColumnResized', width);
        this.$().closest(TOP_LEVEL_CLASS).removeClass('is-resizing');
      }
    },

    _mouseMove: function _mouseMove(e) {
      if (this.get('isResizing')) {
        e.preventDefault();
        e.stopPropagation();

        var resizeOnDrag = this.get('resizeOnDrag');
        var minResizeWidth = this.get('column.minResizeWidth');

        var _getProperties = this.getProperties(['startX', 'startWidth']);

        var startX = _getProperties.startX;
        var startWidth = _getProperties.startWidth;

        var width = Math.max(startWidth + (e.pageX - startX), minResizeWidth) + 'px';

        var $column = this.get('$column');
        var $index = this.get('table.visibleColumns').indexOf(this.get('column')) + 1;
        var $table = this.$().closest(TOP_LEVEL_CLASS);

        $column.outerWidth(width);
        $('thead td.lt-scaffolding:nth-child(' + $index + ')', $table).outerWidth(width);
        $('tfoot td.lt-scaffolding:nth-child(' + $index + ')', $table).outerWidth(width);

        if (resizeOnDrag) {
          $('tbody td:nth-child(' + $index + ')', $table).outerWidth(width);
        }
      }
    }
  });
});