define('ember-drag-drop/components/draggable-object-target', ['exports', 'ember', 'ember-drag-drop/mixins/droppable'], function (exports, _ember, _emberDragDropMixinsDroppable) {
  exports['default'] = _ember['default'].Component.extend(_emberDragDropMixinsDroppable['default'], {
    classNameBindings: ['overrideClass'],
    overrideClass: 'draggable-object-target',
    isOver: false,

    handlePayload: function handlePayload(payload, event) {
      var obj = this.get('coordinator').getObject(payload, { target: this });
      this.sendAction('action', obj, { target: this, event: event });
    },

    handleDrop: function handleDrop(event) {
      var dataTransfer = event.dataTransfer;
      var payload = dataTransfer.getData("Text");
      if (payload === "") {
        return;
      }
      this.handlePayload(payload, event);
    },

    acceptDrop: function acceptDrop(event) {
      this.handleDrop(event);
      //Firefox is navigating to a url on drop sometimes, this prevents that from happening
      event.preventDefault();
    },
    handleDragOver: function handleDragOver(event) {
      if (!this.get('isOver')) {
        //only send once per hover event
        this.set('isOver', true);
        this.sendAction('dragOverAction', event);
      }
    },
    handleDragOut: function handleDragOut(event) {
      this.set('isOver', false);
      this.sendAction('dragOutAction', event);
    },

    click: function click(e) {
      var onClick = this.get('onClick');
      if (onClick) {
        onClick(e.originalEvent);
      }
    },

    mouseDown: function mouseDown(e) {
      var mouseDown = this.get('onMouseDown');
      if (mouseDown) {
        mouseDown(e.originalEvent);
      }
    },

    mouseEnter: function mouseEnter(e) {
      var mouseEnter = this.get('onMouseEnter');
      if (mouseEnter) {
        mouseEnter(e.originalEvent);
      }
    },

    actions: {
      acceptForDrop: function acceptForDrop() {
        var hashId = this.get('coordinator.clickedId');
        this.handlePayload(hashId);
      }
    }
  });
});