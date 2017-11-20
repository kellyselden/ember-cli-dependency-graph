define('ember-drag-drop/components/object-bin', ['exports', 'ember'], function (exports, _ember) {

  var removeOne = function removeOne(arr, obj) {
    var l = arr.get('length');
    arr.removeObject(obj);
    var l2 = arr.get('length');

    if (l - 1 !== l2) {
      throw "bad length " + l + " " + l2;
    }
  };

  exports['default'] = _ember['default'].Component.extend({
    model: _ember['default'].A(),
    classNames: ['draggable-object-bin'],

    manageList: true,

    objectMoved: function objectMoved() {},

    actions: {
      handleObjectDropped: function handleObjectDropped(obj) {
        if (this.get('manageList')) {
          this.get("model").pushObject(obj);
        }

        this.trigger("objectDroppedInternal", obj);
        this.sendAction("objectDropped", { obj: obj, bin: this });
      },

      handleObjectDragged: function handleObjectDragged(obj) {
        if (this.get('manageList')) {
          removeOne(this.get('model'), obj);
        }
        this.trigger("objectDraggedInternal", obj);
        this.sendAction("objectDragged");
      }
    }
  });
});