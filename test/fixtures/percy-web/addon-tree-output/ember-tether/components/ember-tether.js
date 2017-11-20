define('ember-tether/components/ember-tether', ['exports', 'ember'], function (exports, _ember) {
  var observer = _ember['default'].observer;
  var get = _ember['default'].get;
  var getOwner = _ember['default'].getOwner;
  var run = _ember['default'].run;
  var computed = _ember['default'].computed;
  var isNone = _ember['default'].isNone;
  var Component = _ember['default'].Component;
  exports['default'] = Component.extend({
    classNames: ['ember-tether'],
    classPrefix: 'ember-tether',
    target: null,
    attachment: null,
    targetAttachment: null,
    offset: null,
    targetOffset: null,
    targetModifier: null,
    constraints: null,
    optimizations: null,
    emberTetherConfig: computed(function () {
      return (getOwner(this).resolveRegistration('config:environment') || {})['ember-tether'];
    }),
    bodyElement: computed(function () {
      var config = get(this, 'emberTetherConfig');
      if (config && config.bodyElementId) {
        return document.getElementById(config.bodyElementId);
      }
    }),
    didInsertElement: function didInsertElement() {
      this._super.apply(this, arguments);
      this.addTether();
    },

    willDestroyElement: function willDestroyElement() {
      var _this = this;

      this._super.apply(this, arguments);
      var _tether = this._tether;
      var element = this.element;

      run.schedule('render', function () {
        _this.removeElement(element);
        _this.removeTether(_tether);
      });
    },

    didRender: function didRender() {
      this._super.apply(this, arguments);
      this.positionTether();
    },

    tetherDidChange: observer('classPrefix', 'target', 'attachment', 'targetAttachment', 'offset', 'targetOffset', 'targetModifier', 'constraints', 'optimizations', function () {
      this.removeTether(this._tether);
      this.addTether();
    }),

    positionTether: function positionTether() {
      if (this._tether) {
        this._tether.position();
      }
    },

    addTether: function addTether() {
      if (get(this, '_tetherTarget')) {
        this._tether = new Tether(this._tetherOptions());
      }
    },

    removeTether: function removeTether(tether) {
      if (tether) {
        tether.destroy();
      }
    },

    removeElement: function removeElement(element) {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    },

    _tetherTarget: computed('target', function () {
      var t = get(this, 'target');
      if (t && t.element) {
        t = t.element;
      }
      return t;
    }),

    _tetherOptions: function _tetherOptions() {
      var _this2 = this;

      var options = {
        element: this.element,
        target: get(this, '_tetherTarget')
      };
      ['classPrefix', 'attachment', 'targetAttachment', 'offset', 'targetOffset', 'targetModifier', 'constraints', 'optimizations', 'bodyElement'].forEach(function (k) {
        var v = get(_this2, k);
        if (!isNone(v)) {
          options[k] = v;
        }
      });
      return options;
    }
  });
});