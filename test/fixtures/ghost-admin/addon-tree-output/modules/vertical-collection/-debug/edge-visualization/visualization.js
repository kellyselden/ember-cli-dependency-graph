define('vertical-collection/-debug/edge-visualization/visualization', ['exports', 'vertical-collection/-private'], function (exports, _private) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function applyVerticalStyles(element, geography) {
    element.style.height = geography.height + 'px';
    element.style.top = geography.top + 'px';
  }

  var Visualization = function () {
    function Visualization(radar) {
      this.radar = radar;
      this.satellites = [];
      this.cache = [];

      this.wrapper = document.createElement('div');
      this.wrapper.className = 'vertical-collection-visual-debugger';

      this.container = document.createElement('div');
      this.container.className = 'vc_visualization-container';
      this.wrapper.appendChild(this.container);

      this.itemContainer = document.createElement('div');
      this.itemContainer.className = 'vc_visualization-item-container';
      this.container.appendChild(this.itemContainer);

      this.scrollContainer = document.createElement('div');
      this.scrollContainer.className = 'vc_visualization-scroll-container';
      this.container.appendChild(this.scrollContainer);

      this.screen = document.createElement('div');
      this.screen.className = 'vc_visualization-screen';
      this.container.appendChild(this.screen);

      document.body.appendChild(this.wrapper);
    }

    Visualization.prototype.render = function render() {
      this.styleViewport();
      this.updateSatellites();
    };

    Visualization.prototype.styleViewport = function styleViewport() {
      var _radar = this.radar,
          itemContainer = _radar.itemContainer,
          scrollContainer = _radar.scrollContainer;

      this.container.style.height = scrollContainer.getBoundingClientRect().height + 'px';

      applyVerticalStyles(this.scrollContainer, scrollContainer.getBoundingClientRect());
      applyVerticalStyles(this.itemContainer, itemContainer.getBoundingClientRect());
      applyVerticalStyles(this.screen, _private.Container.getBoundingClientRect());
    };

    Visualization.prototype.makeSatellite = function makeSatellite() {
      var satellite = void 0;

      if (this.cache.length) {
        satellite = this.cache.pop();
      } else {
        satellite = document.createElement('div');
        satellite.className = 'vc_visualization-virtual-component';
      }

      this.satellites.push(satellite);
      this.itemContainer.append(satellite);
    };

    Visualization.prototype.updateSatellites = function updateSatellites() {
      var sats = this.satellites;
      var _radar2 = this.radar,
          firstItemIndex = _radar2.firstItemIndex,
          lastItemIndex = _radar2.lastItemIndex,
          totalItems = _radar2.totalItems,
          totalBefore = _radar2.totalBefore,
          totalAfter = _radar2.totalAfter,
          skipList = _radar2.skipList,
          _estimateHeight = _radar2._estimateHeight;


      var isDynamic = !!skipList;
      var itemHeights = isDynamic && skipList.values;

      var firstVisualizedIndex = Math.max(firstItemIndex - 10, 0);
      var lastVisualizedIndex = Math.min(lastItemIndex + 10, totalItems - 1);

      var lengthWithBuffer = lastVisualizedIndex - firstVisualizedIndex + 1;
      var isShrinking = sats.length > lengthWithBuffer;

      while (sats.length !== lengthWithBuffer) {
        if (isShrinking) {
          var satellite = sats.pop();

          satellite.parentNode.removeChild(satellite);
          this.cache.push(satellite);
        } else {
          this.makeSatellite();
        }
      }

      for (var itemIndex = firstVisualizedIndex, i = 0; itemIndex <= lastVisualizedIndex; itemIndex++, i++) {
        var element = sats[i];

        var itemHeight = isDynamic ? itemHeights[itemIndex] : _estimateHeight;

        element.style.height = itemHeight + 'px';
        element.setAttribute('index', String(itemIndex));
        element.innerText = String(itemIndex);

        if (itemIndex < firstItemIndex) {
          element.classList.add('culled');
          totalBefore -= itemHeight;
        } else if (itemIndex > lastItemIndex) {
          element.classList.add('culled');
          totalAfter -= itemHeight;
        } else {
          element.classList.remove('culled');
        }
      }

      this.itemContainer.style.paddingTop = totalBefore + 'px';
      this.itemContainer.style.paddingBottom = totalAfter + 'px';
    };

    Visualization.prototype.destroy = function destroy() {
      this.wrapper.parentNode.removeChild(this.wrapper);
      this.wrapper = null;
      this.radar = null;
      this.component = null;
      this.satellites.forEach(function (satellite) {
        if (satellite.parentNode) {
          satellite.parentNode.removeChild(satellite);
        }
      });
      this.satellites = null;
      this.cache = null;
    };

    return Visualization;
  }();

  exports.default = Visualization;
});