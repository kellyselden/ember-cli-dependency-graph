define('ember-computed-decorators/index', ['exports', 'ember', 'ember-computed-decorators/utils/handle-descriptor', 'ember-computed-decorators/utils/is-descriptor', 'ember-computed-decorators/utils/extract-value', 'ember-computed-decorators/decorator-alias', 'ember-computed-decorators/macro-alias'], function (exports, _ember, _emberComputedDecoratorsUtilsHandleDescriptor, _emberComputedDecoratorsUtilsIsDescriptor, _emberComputedDecoratorsUtilsExtractValue, _emberComputedDecoratorsDecoratorAlias, _emberComputedDecoratorsMacroAlias) {
  var _slice = Array.prototype.slice;
  exports['default'] = computedDecorator;
  exports.readOnly = readOnly;

  function computedDecorator() {
    for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
      params[_key] = arguments[_key];
    }

    // determine if user called as @computed('blah', 'blah') or @computed
    if ((0, _emberComputedDecoratorsUtilsIsDescriptor['default'])(params[params.length - 1])) {
      return _emberComputedDecoratorsUtilsHandleDescriptor['default'].apply(undefined, arguments);
    } else {
      return function () /* target, key, desc */{
        return _emberComputedDecoratorsUtilsHandleDescriptor['default'].apply(undefined, _slice.call(arguments).concat([params]));
      };
    }
  }

  function readOnly(target, name, desc) {
    return {
      writable: false,
      enumerable: desc.enumerable,
      configurable: desc.configurable,
      initializer: function initializer() {
        var value = (0, _emberComputedDecoratorsUtilsExtractValue['default'])(desc);
        return value.readOnly();
      }
    };
  }

  var on = (0, _emberComputedDecoratorsDecoratorAlias['default'])(_ember['default'].on, 'Can not `on` without event names');
  exports.on = on;
  var observes = (0, _emberComputedDecoratorsDecoratorAlias['default'])(_ember['default'].observer, 'Can not `observe` without property names');

  exports.observes = observes;
  var alias = (0, _emberComputedDecoratorsMacroAlias['default'])(_ember['default'].computed.alias);
  exports.alias = alias;
  var and = (0, _emberComputedDecoratorsMacroAlias['default'])(_ember['default'].computed.and);
  exports.and = and;
  var bool = (0, _emberComputedDecoratorsMacroAlias['default'])(_ember['default'].computed.bool);
  exports.bool = bool;
  var collect = (0, _emberComputedDecoratorsMacroAlias['default'])(_ember['default'].computed.collect);
  exports.collect = collect;
  var empty = (0, _emberComputedDecoratorsMacroAlias['default'])(_ember['default'].computed.empty);
  exports.empty = empty;
  var equal = (0, _emberComputedDecoratorsMacroAlias['default'])(_ember['default'].computed.equal);
  exports.equal = equal;
  var filter = (0, _emberComputedDecoratorsMacroAlias['default'])(_ember['default'].computed.filter);
  exports.filter = filter;
  var filterBy = (0, _emberComputedDecoratorsMacroAlias['default'])(_ember['default'].computed.filterBy);
  exports.filterBy = filterBy;
  var gt = (0, _emberComputedDecoratorsMacroAlias['default'])(_ember['default'].computed.gt);
  exports.gt = gt;
  var gte = (0, _emberComputedDecoratorsMacroAlias['default'])(_ember['default'].computed.gte);
  exports.gte = gte;
  var intersect = (0, _emberComputedDecoratorsMacroAlias['default'])(_ember['default'].computed.intersect);
  exports.intersect = intersect;
  var lt = (0, _emberComputedDecoratorsMacroAlias['default'])(_ember['default'].computed.lt);
  exports.lt = lt;
  var lte = (0, _emberComputedDecoratorsMacroAlias['default'])(_ember['default'].computed.lte);
  exports.lte = lte;
  var map = (0, _emberComputedDecoratorsMacroAlias['default'])(_ember['default'].computed.map);
  exports.map = map;
  var mapBy = (0, _emberComputedDecoratorsMacroAlias['default'])(_ember['default'].computed.mapBy);
  exports.mapBy = mapBy;
  var match = (0, _emberComputedDecoratorsMacroAlias['default'])(_ember['default'].computed.match);
  exports.match = match;
  var max = (0, _emberComputedDecoratorsMacroAlias['default'])(_ember['default'].computed.max);
  exports.max = max;
  var min = (0, _emberComputedDecoratorsMacroAlias['default'])(_ember['default'].computed.min);
  exports.min = min;
  var none = (0, _emberComputedDecoratorsMacroAlias['default'])(_ember['default'].computed.none);
  exports.none = none;
  var not = (0, _emberComputedDecoratorsMacroAlias['default'])(_ember['default'].computed.not);
  exports.not = not;
  var notEmpty = (0, _emberComputedDecoratorsMacroAlias['default'])(_ember['default'].computed.notEmpty);
  exports.notEmpty = notEmpty;
  var oneWay = (0, _emberComputedDecoratorsMacroAlias['default'])(_ember['default'].computed.oneWay);
  exports.oneWay = oneWay;
  var or = (0, _emberComputedDecoratorsMacroAlias['default'])(_ember['default'].computed.or);
  exports.or = or;
  var reads = (0, _emberComputedDecoratorsMacroAlias['default'])(_ember['default'].computed.reads);
  exports.reads = reads;
  var setDiff = (0, _emberComputedDecoratorsMacroAlias['default'])(_ember['default'].computed.setDiff);
  exports.setDiff = setDiff;
  var sort = (0, _emberComputedDecoratorsMacroAlias['default'])(_ember['default'].computed.sort);
  exports.sort = sort;
  var sum = (0, _emberComputedDecoratorsMacroAlias['default'])(_ember['default'].computed.sum);
  exports.sum = sum;
  var union = (0, _emberComputedDecoratorsMacroAlias['default'])(_ember['default'].computed.union);
  exports.union = union;
  var uniq = (0, _emberComputedDecoratorsMacroAlias['default'])(_ember['default'].computed.uniq);
  exports.uniq = uniq;
});