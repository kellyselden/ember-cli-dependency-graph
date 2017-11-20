define('ghost-admin/utils/format-markdown', ['exports', 'ghost-admin/utils/caja-sanitizers', 'npm:markdown-it', 'npm:markdown-it-footnote', 'npm:markdown-it-lazy-headers', 'npm:markdown-it-mark'], function (exports, _cajaSanitizers, _npmMarkdownIt, _npmMarkdownItFootnote, _npmMarkdownItLazyHeaders, _npmMarkdownItMark) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = formatMarkdown;


    var slugify = function slugify(inputString, usedHeaders) {
        var slug = inputString.replace(/[^\w]/g, '').toLowerCase();
        if (usedHeaders[slug]) {
            usedHeaders[slug]++;
            slug += usedHeaders[slug];
        }
        return slug;
    };

    // originally from https://github.com/leff/markdown-it-named-headers
    // moved here to avoid pulling in http://stringjs.com dependency
    /* global html_sanitize */
    var markdownitNamedHeaders = function markdownitNamedHeaders(md) {
        var originalHeadingOpen = md.renderer.rules.heading_open;

        // eslint-disable-next-line camelcase
        md.renderer.rules.heading_open = function (tokens, idx, options, env, self) {
            var usedHeaders = {};

            tokens[idx].attrs = tokens[idx].attrs || [];

            var title = tokens[idx + 1].children.reduce(function (acc, t) {
                return acc + t.content;
            }, '');

            var slug = slugify(title, usedHeaders);
            tokens[idx].attrs.push(['id', slug]);

            if (originalHeadingOpen) {
                return originalHeadingOpen.apply(this, arguments);
            } else {
                return self.renderToken.apply(self, arguments);
            }
        };
    };

    var md = (0, _npmMarkdownIt.default)({
        html: true,
        breaks: true,
        linkify: true
    }).use(_npmMarkdownItFootnote.default).use(_npmMarkdownItLazyHeaders.default).use(_npmMarkdownItMark.default).use(markdownitNamedHeaders);

    // configure linkify-it
    md.linkify.set({
        fuzzyLink: false
    });

    function formatMarkdown(_markdown) {
        var replaceJS = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var markdown = _markdown || '';
        var escapedhtml = '';

        // convert markdown to HTML
        escapedhtml = md.render(markdown);

        // replace script and iFrame
        if (replaceJS) {
            escapedhtml = escapedhtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '<pre class="js-embed-placeholder">Embedded JavaScript</pre>');
            escapedhtml = escapedhtml.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '<pre class="iframe-embed-placeholder">Embedded iFrame</pre>');
        }

        // sanitize html
        escapedhtml = html_sanitize(escapedhtml, _cajaSanitizers.default.url, _cajaSanitizers.default.id);

        return escapedhtml;
    }
});