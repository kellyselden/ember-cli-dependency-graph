define('ember-light-table/mixins/draggable-column', ['exports', 'ember'], function (exports, _ember) {
  var _slice = Array.prototype.slice;
  var run = _ember['default'].run;
  var computed = _ember['default'].computed;

  var sourceColumn = undefined;

  exports['default'] = _ember['default'].Mixin.create({
    classNameBindings: ['isDragging', 'isDragTarget', 'dragDirection'],
    attributeBindings: ['isDraggable:draggable'],

    isDragging: false,
    isDragTarget: false,

    dragDirection: computed('isDragTarget', function () {
      if (this.get('isDragTarget')) {
        var columns = this.get('dragColumnGroup');
        var targetIdx = columns.indexOf(this.get('column'));
        var sourceIdx = columns.indexOf(sourceColumn);
        var direction = sourceIdx - targetIdx < 0 ? 'right' : 'left';

        return 'drag-' + direction;
      }
    }).readOnly(),

    /**
     * Array of Columns indicating where the column can be potentially dragged.
     * If the column is part of a group (has a parent column), this will be all of the columns in that group,
     * otherwise it's all of the columns in the table.
     *
     * @property dragColumnGroup
     * @type Array
     * @readonly
     */
    dragColumnGroup: computed('column.parent', function () {
      var parent = this.get('column.parent');
      return parent ? parent.get('subColumns') : this.get('table.columns');
    }).readOnly(),

    isDropTarget: computed(function () {
      var column = this.get('column');
      /*
        A column is a valid drop target only if its in the same group
       */
      return column.get('droppable') && column.get('parent') === sourceColumn.get('parent');
    }).volatile().readOnly(),

    dragStart: function dragStart(e) {
      this._super.apply(this, arguments);

      var column = this.get('column');

      /*
        NOTE: IE requires setData type to be 'text'
       */
      e.dataTransfer.setData('text', column.get('columnId'));
      e.dataTransfer.effectAllowed = 'move';

      sourceColumn = column;
      this.set('isDragging', true);
      this.sendAction.apply(this, ['onColumnDrag', sourceColumn].concat(_slice.call(arguments)));

      /*
        NOTE: This is a fix for Firefox to prevent the click event
        from being triggered after a drop.
       */
      this.__click__ = this.click;
      this.click = undefined;
    },

    dragEnter: function dragEnter(e) {
      this._super.apply(this, arguments);

      if (this.get('isDropTarget')) {
        e.preventDefault();
        this.set('isDragTarget', this.get('column') !== sourceColumn);
      }
    },

    dragOver: function dragOver(e) {
      this._super.apply(this, arguments);

      if (this.get('isDropTarget')) {
        e.preventDefault();
      }
    },

    dragLeave: function dragLeave() {
      this._super.apply(this, arguments);
      this.set('isDragTarget', false);
    },

    dragEnd: function dragEnd() {
      var _this = this;

      this._super.apply(this, arguments);

      this.setProperties({ isDragTarget: false, isDragging: false });

      /*
        If sourceColumn still references a column, it means that a successful
        drop did not happen.
       */
      if (sourceColumn) {
        this.sendAction.apply(this, ['onColumnDrop', sourceColumn, false].concat(_slice.call(arguments)));
        sourceColumn = null;
      }

      /*
        Restore click event
       */
      this._clickResetTimer = run.next(this, function () {
        return _this.click = _this.__click__;
      });
    },

    drop: function drop(e) {
      this._super.apply(this, arguments);

      var table = this.get('table');
      var targetColumn = this.get('column');
      var columns = this.get('dragColumnGroup');

      var _columns = columns.toArray();
      var targetColumnIdx = _columns.indexOf(targetColumn);

      e.dataTransfer.dropEffect = 'move';
      e.preventDefault();
      e.stopPropagation();

      table.propertyWillChange('columns');

      _columns.removeObject(sourceColumn);
      _columns.insertAt(targetColumnIdx, sourceColumn);
      columns.setObjects(_columns);

      table.propertyDidChange('columns');

      this.setProperties({ isDragTarget: false, isDragging: false });

      this.sendAction.apply(this, ['onColumnDrop', sourceColumn, true].concat(_slice.call(arguments)));
      sourceColumn = null;
    },

    destroy: function destroy() {
      this._super.apply(this, arguments);
      run.cancel(this._clickResetTimer);
    }
  });
});