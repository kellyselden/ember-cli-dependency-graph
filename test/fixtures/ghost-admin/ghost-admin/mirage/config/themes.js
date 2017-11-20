define('ghost-admin/mirage/config/themes', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = mockThemes;


    var themeCount = 1;

    function mockThemes(server) {
        server.get('/themes');

        server.post('/themes/upload/', function (_ref) {
            var themes = _ref.themes;

            // pretender/mirage doesn't currently process FormData so we can't use
            // any info passed in through the request
            var theme = {
                name: 'test-' + themeCount,
                package: {
                    name: 'Test ' + themeCount,
                    version: '0.1'
                }
            };

            themeCount++;

            theme = themes.create(theme);

            return { themes: [theme] };
        });

        server.del('/themes/:theme/', function (_ref2, _ref3) {
            var themes = _ref2.themes;
            var params = _ref3.params;

            themes.findBy({ name: params.theme }).destroy();

            return new _emberCliMirage.Response(204, {}, null);
        });

        server.put('/themes/:theme/activate/', function (_ref4, _ref5) {
            var themes = _ref4.themes;
            var params = _ref5.params;

            themes.all().update('active', false);
            var theme = themes.findBy({ name: params.theme }).update({ active: true });

            return { themes: [theme] };
        });
    }
});