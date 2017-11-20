define('ember-drag-drop/components/draggable-object', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    dragCoordinator: _ember['default'].inject.service(),
    tagName: "div",
    overrideClass: 'draggable-object',
    classNameBindings: [':js-draggableObject', 'isDraggingObject:is-dragging-object:', 'overrideClass'],
    attributeBindings: ['dragReady:draggable'],
    isDraggable: true,
    dragReady: true,
    isSortable: false,
    sortingScope: 'drag-objects',
    title: _ember['default'].computed.alias('content.title'),

    draggable: _ember['default'].computed('isDraggable', function () {
      var isDraggable = this.get('isDraggable');

      if (isDraggable) {
        return true;
      } else {
        return null;
      }
    }),

    init: function init() {
      if (this.get('dragHandle')) {
        this.set('dragReady', false);
      }
      this._super.apply(this, arguments);
    },

    didInsertElement: function didInsertElement() {
      var _this = this;

      _ember['default'].run.scheduleOnce('afterRender', function () {
        var self = _this;
        //if there is a drag handle watch the mouse up and down events to trigger if drag is allowed
        if (_this.get('dragHandle')) {
          //only start when drag handle is activated
          if (_this.$(_this.get('dragHandle'))) {
            _this.$(_this.get('dragHandle')).on('mouseover', function () {
              self.set('dragReady', true);
            });
            _this.$(_this.get('dragHandle')).on('mouseout', function () {
              self.set('dragReady', false);
            });
          }
        }
      });
    },

    willDestroyElement: function willDestroyElement() {
      if (this.$(this.get('dragHandle'))) {
        this.$(this.get('dragHandle')).off();
      }
    },

    dragStart: function dragStart(event) {
      var _this2 = this;

      if (!this.get('isDraggable') || !this.get('dragReady')) {
        event.preventDefault();
        return;
      }

      var dataTransfer = event.dataTransfer;

      var obj = this.get('content');
      var id = null;
      if (this.get('coordinator')) {
        id = this.get('coordinator').setObject(obj, { source: this });
      }

      dataTransfer.setData('Text', id);

      if (obj && typeof obj === 'object') {
        _ember['default'].set(obj, 'isDraggingObject', true);
      }
      this.set('isDraggingObject', true);
      if (!this.get('dragCoordinator.enableSort') && this.get('dragCoordinator.sortComponentController')) {
        //disable drag if sorting is disabled this is not used for regular
        event.preventDefault();
        return;
      } else {
        _ember['default'].run.later(function () {
          _this2.dragStartHook(event);
        });
        this.get('dragCoordinator').dragStarted(obj, event, this);
      }
      this.sendAction('dragStartAction', obj, event);
      if (this.get('isSortable')) {
        this.sendAction('draggingSortItem', obj, event);
      }
    },

    dragEnd: function dragEnd(event) {
      if (!this.get('isDraggingObject')) {
        return;
      }

      var obj = this.get('content');

      if (obj && typeof obj === 'object') {
        _ember['default'].set(obj, 'isDraggingObject', false);
      }
      this.set('isDraggingObject', false);
      this.dragEndHook(event);
      this.get('dragCoordinator').dragEnded();
      this.sendAction('dragEndAction', obj, event);
      if (this.get('dragHandle')) {
        this.set('dragReady', false);
      }
    },

    drag: function drag(event) {
      this.sendAction('dragMoveAction', event);
    },

    dragOver: function dragOver(event) {
      if (this.get('isSortable')) {
        this.get('dragCoordinator').draggingOver(event, this);
      }
      return false;
    },

    dragStartHook: function dragStartHook(event) {
      _ember['default'].$(event.target).css('opacity', '0.5');
    },

    dragEndHook: function dragEndHook(event) {
      _ember['default'].$(event.target).css('opacity', '1');
    },

    drop: function drop(event) {
      //Firefox is navigating to a url on drop, this prevents that from happening
      event.preventDefault();
    },

    actions: {
      selectForDrag: function selectForDrag() {
        var obj = this.get('content');
        var hashId = this.get('coordinator').setObject(obj, { source: this });
        this.set('coordinator.clickedId', hashId);
      }
    }
  });
});