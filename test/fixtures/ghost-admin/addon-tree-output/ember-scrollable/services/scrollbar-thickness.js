define('ember-scrollable/services/scrollbar-thickness', ['exports', 'ember'], function (exports, _ember) {
  var computed = _ember['default'].computed;
  var Service = _ember['default'].Service;
  var $ = _ember['default'].$;
  exports['default'] = Service.extend({
    thickness: computed(function () {
      var tempEl = $('\n      <div class="scrollbar-width-tester" style="width: 50px; position: absolute; left: -100px;">\n        <div style="overflow: scroll;">\n          <div class="scrollbar-width-tester__inner"></div>\n        </div>\n      </div>\n    ');
      $('body').append(tempEl);
      var width = $(tempEl).width();
      var widthMinusScrollbars = $('.scrollbar-width-tester__inner', tempEl).width();
      tempEl.remove();

      return width - widthMinusScrollbars;
    })
  });
});