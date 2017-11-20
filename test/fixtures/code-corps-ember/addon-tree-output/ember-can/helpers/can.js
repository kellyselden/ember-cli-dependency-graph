define('ember-can/helpers/can', ['exports', 'ember'], function (exports, _ember) {
  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  exports['default'] = _ember['default'].Helper.extend({
    can: _ember['default'].inject.service(),

    compute: function compute(_ref, hash) {
      var _ref2 = _slicedToArray(_ref, 2);

      var name = _ref2[0];
      var resource = _ref2[1];

      var service = this.get('can');
      var ability = service.build(name, resource, hash);

      var _service$parse = service.parse(name);

      var propertyName = _service$parse.propertyName;

      if (this._ability) {
        this._ability.removeObserver(this._abilityProp, this, 'recompute');
      }

      this._ability = ability;
      this._abilityProp = propertyName;

      ability.addObserver(propertyName, this, 'recompute');

      return ability.get(propertyName);
    },

    destroy: function destroy() {
      this._ability.removeObserver(this._abilityProp, this, 'recompute');
      return this._super();
    }
  });
});