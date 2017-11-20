define('ember-drag-drop/services/drag-coordinator', ['exports', 'ember'], function (exports, _ember) {

  function swapInPlace(items, a, b) {
    var aPos = items.indexOf(a);
    var bPos = items.indexOf(b);

    items.replace(aPos, 1, [b]);
    items.replace(bPos, 1, [a]);
  }

  function shiftInPlace(items, a, b) {
    var aPos = items.indexOf(a);
    var bPos = items.indexOf(b);

    items.removeAt(aPos);
    items.insertAt(bPos, a);
  }

  exports['default'] = _ember['default'].Service.extend({
    sortComponentController: null,
    currentDragObject: null,
    currentDragEvent: null,
    currentDragItem: null,
    currentOffsetItem: null,
    isMoving: false,
    lastEvent: null,
    sortComponents: {}, // Use object for sortComponents so that we can scope per sortingScope

    arrayList: _ember['default'].computed.alias('sortComponentController.sortableObjectList'),
    enableSort: _ember['default'].computed.alias('sortComponentController.enableSort'),
    useSwap: _ember['default'].computed.alias('sortComponentController.useSwap'),
    inPlace: _ember['default'].computed.alias('sortComponentController.inPlace'),

    pushSortComponent: function pushSortComponent(component) {
      var sortingScope = component.get('sortingScope');
      if (!this.get('sortComponents')[sortingScope]) {
        this.get('sortComponents')[sortingScope] = _ember['default'].A();
      }
      this.get('sortComponents')[sortingScope].pushObject(component);
    },

    removeSortComponent: function removeSortComponent(component) {
      var sortingScope = component.get('sortingScope');
      this.get('sortComponents')[sortingScope].removeObject(component);
    },

    dragStarted: function dragStarted(object, event, emberObject) {
      this.set('currentDragObject', object);
      this.set('currentDragEvent', event);
      this.set('currentDragItem', emberObject);
      event.dataTransfer.effectAllowed = 'move';
    },

    dragEnded: function dragEnded() {
      this.set('currentDragObject', null);
      this.set('currentDragEvent', null);
      this.set('currentDragItem', null);
      this.set('currentOffsetItem', null);
    },

    draggingOver: function draggingOver(event, emberObject) {
      var currentOffsetItem = this.get('currentOffsetItem');
      var pos = this.relativeClientPosition(emberObject.$()[0], event);
      var hasSameSortingScope = this.get('currentDragItem.sortingScope') === emberObject.get('sortingScope');
      var moveDirection = false;

      if (!this.get('lastEvent')) {
        this.set('lastEvent', event);
      }

      if (event.originalEvent.clientY < this.get('lastEvent').originalEvent.clientY) {
        moveDirection = 'up';
      }

      if (event.originalEvent.clientY > this.get('lastEvent').originalEvent.clientY) {
        moveDirection = 'down';
      }

      this.set('lastEvent', event);

      if (!this.get('isMoving')) {
        if (event.target !== this.get('currentDragEvent').target && hasSameSortingScope) {
          //if not dragging over self
          if (currentOffsetItem !== emberObject) {
            if (pos.py > 0.33 && moveDirection === 'up' || pos.py > 0.33 && moveDirection === 'down') {

              this.moveElements(emberObject);
              this.set('currentOffsetItem', emberObject);
            }
          }
        } else {
          //reset because the node moved under the mouse with a move
          this.set('currentOffsetItem', null);
        }
      }
    },

    moveObjectPositions: function moveObjectPositions(a, b, sortComponents) {
      var aSortable = sortComponents.find(function (component) {
        return component.get('sortableObjectList').find(function (sortable) {
          return sortable === a;
        });
      });
      var bSortable = sortComponents.find(function (component) {
        return component.get('sortableObjectList').find(function (sortable) {
          return sortable === b;
        });
      });
      var swap = aSortable === bSortable;

      if (swap) {

        var list = aSortable.get('sortableObjectList');
        if (!this.get('inPlace')) {
          list = list.toArray();
        }

        if (this.get('useSwap')) {
          swapInPlace(list, a, b);
        } else {
          shiftInPlace(list, a, b);
        }

        if (!this.get('inPlace')) {
          aSortable.set('sortableObjectList', list);
        }
      } else {
        // Move if items are in different sortable-objects component
        var aList = aSortable.get('sortableObjectList');
        var bList = bSortable.get('sortableObjectList');

        // Remove from aList and insert into bList
        aList.removeObject(a);
        bList.insertAt(bList.indexOf(b), a);
      }
    },

    moveElements: function moveElements(overElement) {
      var isEnabled = Object.keys(this.get('sortComponents')).length;
      var draggingItem = this.get('currentDragItem');
      var sortComponents = this.get('sortComponents')[draggingItem.get('sortingScope')];

      if (!isEnabled) {
        return;
      }

      this.moveObjectPositions(draggingItem.get('content'), overElement.get('content'), sortComponents);

      sortComponents.forEach(function (component) {
        component.rerender();
      });
    },

    relativeClientPosition: function relativeClientPosition(el, event) {
      var rect = el.getBoundingClientRect();
      var x = event.originalEvent.clientX - rect.left;
      var y = event.originalEvent.clientY - rect.top;

      return {
        x: x,
        y: y,
        px: x / rect.width,
        py: y / rect.height
      };
    }
  });
});