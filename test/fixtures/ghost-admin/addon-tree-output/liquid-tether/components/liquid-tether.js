define('liquid-tether/components/liquid-tether', ['exports', 'ember', 'liquid-wormhole/components/liquid-wormhole'], function (exports, _ember, _liquidWormholeComponentsLiquidWormhole) {
  var computed = _ember['default'].computed;
  var get = _ember['default'].get;
  var run = _ember['default'].run;
  var camelize = _ember['default'].String.camelize;
  exports['default'] = _liquidWormholeComponentsLiquidWormhole['default'].extend({
    classPrefix: 'liquid-tether',
    target: null,
    attachment: null,
    targetAttachment: null,
    offset: null,
    targetOffset: null,
    targetModifier: null,
    constraints: null,
    optimizations: null,

    didInsertElement: function didInsertElement() {
      this._super.apply(this, arguments);

      this._tetherElement = this.get('nodes')[0];
    },

    willAppendNodes: function willAppendNodes(bodyElement) {
      if (this._tether) {
        this.removeTether();
      }

      this.addTether(bodyElement);
    },

    didAppendNodes: function didAppendNodes() {
      this._tether.position();
    },

    willRemoveNodes: function willRemoveNodes() {
      this._tether.position();
    },

    willDestroyElement: function willDestroyElement() {
      var _this = this;

      this._super.apply(this, arguments);

      run.schedule('render', function () {
        _this.removeTether();
      });
    },

    addTether: function addTether(bodyElement) {
      var _this2 = this;

      var target = this.get('_tetherTarget');

      var element = this._tetherElement;

      var options = { element: element, target: target, bodyElement: bodyElement };

      ['classPrefix', 'attachment', 'targetAttachment', 'offset', 'targetOffset', 'targetModifier', 'constraints', 'optimizations'].forEach(function (k) {
        var v = get(_this2, k);
        if (!_ember['default'].isNone(v)) {
          options[camelize(k)] = v;
        }
      });

      this._tether = new Tether(options);
    },

    removeTether: function removeTether() {
      if (this._tether) {
        this._tether.destroy();
      }
    },

    _tetherTarget: computed('target', function () {
      var target = get(this, 'target');

      if (target && target.element) {
        return target.element;
      } else if (target === 'document.body') {
        return document.body;
      }

      _ember['default'].assert('Tether target "' + target + '" does not exist in the document', target instanceof Element || document.querySelector(target) !== null);

      return target;
    }),

    actions: {
      clickOverlay: function clickOverlay() {
        if (this.get('on-overlay-click')) {
          this.sendAction('on-overlay-click');
        }
      }
    }
  });
});