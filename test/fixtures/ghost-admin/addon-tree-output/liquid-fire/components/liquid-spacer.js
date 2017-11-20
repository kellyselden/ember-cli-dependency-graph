define('liquid-fire/components/liquid-spacer', ['exports', 'liquid-fire/components/liquid-measured', 'liquid-fire/growable', 'liquid-fire/templates/components/liquid-spacer'], function (exports, _liquidMeasured, _growable, _liquidSpacer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var observer = Ember.observer;
  var Component = Ember.Component;
  exports.default = Component.extend(_growable.default, {
    layout: _liquidSpacer.default,
    enabled: true,

    didInsertElement: function didInsertElement() {
      var child = this.$('> div');
      var measurements = this.myMeasurements((0, _liquidMeasured.measure)(child));
      var elt = this.$();
      elt.css('overflow', 'hidden');
      if (this.get('growWidth')) {
        elt.outerWidth(measurements.width);
      }
      if (this.get('growHeight')) {
        elt.outerHeight(measurements.height);
      }
    },

    sizeChange: observer('measurements', function () {
      if (!this.get('enabled')) {
        return;
      }
      var elt = this.$();
      if (!elt || !elt[0]) {
        return;
      }
      var want = this.myMeasurements(this.get('measurements'));
      var have = (0, _liquidMeasured.measure)(this.$());
      this.animateGrowth(elt, have, want);
    }),

    // given our child's outerWidth & outerHeight, figure out what our
    // outerWidth & outerHeight should be.
    myMeasurements: function myMeasurements(childMeasurements) {
      var elt = this.$();
      return {
        width: childMeasurements.width + sumCSS(elt, padding('width')) + sumCSS(elt, border('width')),
        height: childMeasurements.height + sumCSS(elt, padding('height')) + sumCSS(elt, border('height'))
      };
      //if (this.$().css('box-sizing') === 'border-box') {
    }

  });


  function sides(dimension) {
    return dimension === 'width' ? ['Left', 'Right'] : ['Top', 'Bottom'];
  }

  function padding(dimension) {
    var s = sides(dimension);
    return ['padding' + s[0], 'padding' + s[1]];
  }

  function border(dimension) {
    var s = sides(dimension);
    return ['border' + s[0] + 'Width', 'border' + s[1] + 'Width'];
  }

  function sumCSS(elt, fields) {
    var accum = 0;
    for (var i = 0; i < fields.length; i++) {
      var num = parseFloat(elt.css(fields[i]), 10);
      if (!isNaN(num)) {
        accum += num;
      }
    }
    return accum;
  }
});