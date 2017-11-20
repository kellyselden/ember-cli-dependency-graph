define('ghost-admin/components/gh-theme-table', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var computed = Ember.computed;
    var get = Ember.get;
    exports.default = Component.extend({

        themes: null,

        sortedThemes: computed('themes.@each.active', function () {
            var themes = get(this, 'themes').map(function (t) {
                var theme = {};
                var themePackage = get(t, 'package');

                theme.model = t;
                theme.name = get(t, 'name');
                theme.label = themePackage ? '' + themePackage.name : theme.name;
                theme.version = themePackage ? '' + themePackage.version : '1.0';
                theme.package = themePackage;
                theme.active = get(t, 'active');
                theme.isDeletable = !theme.active;

                return theme;
            });
            var duplicateThemes = [];

            themes.forEach(function (theme) {
                var duplicateLabels = themes.filterBy('label', theme.label);

                if (duplicateLabels.length > 1) {
                    duplicateThemes.pushObject(theme);
                }
            });

            duplicateThemes.forEach(function (theme) {
                if (theme.name !== 'casper') {
                    theme.label = theme.label + ' (' + theme.name + ')';
                }
            });

            // "(default)" needs to be added to casper manually as it's always
            // displayed and would mess up the duplicate checking if added earlier
            var casper = themes.findBy('name', 'casper');
            if (casper) {
                casper.label = casper.label + ' (default)';
                casper.isDefault = true;
                casper.isDeletable = false;
            }

            // sorting manually because .sortBy('label') has a different sorting
            // algorithm to [...strings].sort()
            return themes.sort(function (themeA, themeB) {
                var a = themeA.label.toLowerCase();
                var b = themeB.label.toLowerCase();

                if (a < b) {
                    return -1;
                }
                if (a > b) {
                    return 1;
                }
                return 0;
            });
        }).readOnly()

    });
});