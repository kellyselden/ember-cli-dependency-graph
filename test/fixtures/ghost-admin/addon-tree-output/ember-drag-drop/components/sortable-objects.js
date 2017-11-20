define('ember-drag-drop/components/sortable-objects', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    dragCoordinator: _ember['default'].inject.service(),
    tagName: 'div',
    overrideClass: 'sortable-objects',
    classNameBindings: ['overrideClass'],
    enableSort: true,
    useSwap: true,
    inPlace: false,
    sortingScope: 'drag-objects',
    sortableObjectList: _ember['default'].A(),

    init: function init() {
      this._super.apply(this, arguments);
      if (this.get('enableSort')) {
        this.get('dragCoordinator').pushSortComponent(this);
      }
    },

    willDestroyElement: function willDestroyElement() {
      if (this.get('enableSort')) {
        this.get('dragCoordinator').removeSortComponent(this);
      }
    },

    dragStart: function dragStart(event) {
      event.stopPropagation();
      if (!this.get('enableSort')) {
        return false;
      }
      this.set('dragCoordinator.sortComponentController', this);
    },

    dragEnter: function dragEnter(event) {
      //needed so drop event will fire
      event.stopPropagation();
      return false;
    },

    dragOver: function dragOver(event) {
      //needed so drop event will fire
      event.stopPropagation();
      return false;
    },

    drop: function drop(event) {
      event.stopPropagation();
      if (this.get('enableSort')) {
        this.sendAction('sortEndAction', event);
      }
    }
  });
});