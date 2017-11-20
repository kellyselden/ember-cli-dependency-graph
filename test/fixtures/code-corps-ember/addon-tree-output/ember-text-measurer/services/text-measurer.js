define('ember-text-measurer/services/text-measurer', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Service.extend({
    init: function init() {
      this._super.apply(this, arguments);
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
    },

    width: function width(string) {
      var font = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      if (font) {
        this.ctx.font = font;
      }
      return this.ctx.measureText(string).width;
    },

    lines: function lines(string, maxWidth) {
      var font = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

      if (font) {
        this.ctx.font = font;
      }
      var paragraphs = string.split(/\n/);
      var lines = paragraphs.length;
      for (var i = 0; i < paragraphs.length; i++) {
        var paragraph = paragraphs[i];
        if (paragraph !== '') {
          var words = paragraph.split(' ');
          var widthSoFar = 0;
          var j = 0;
          for (; j < words.length - 1; j++) {
            var _wordWidth = this.ctx.measureText(words[j] + ' ').width;
            widthSoFar = widthSoFar + _wordWidth;
            if (widthSoFar > maxWidth) {
              lines++;
              widthSoFar = _wordWidth;
            }
          }
          var wordWidth = this.ctx.measureText(words[j]).width;
          widthSoFar = widthSoFar + wordWidth;
          if (widthSoFar > maxWidth) {
            lines++;
            widthSoFar = wordWidth;
          }
        }
      }
      return lines;
    },

    fitTextSize: function fitTextSize(string, maxWidth) {
      var font = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

      var width = this.width(string, font);
      var fontSize = this.ctx.font.match(/\d+/)[0];
      return Math.floor(parseFloat(fontSize) * maxWidth / width);
    }
  });
});