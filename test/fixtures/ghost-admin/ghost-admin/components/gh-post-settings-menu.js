define('ghost-admin/components/gh-post-settings-menu', ['exports', 'ghost-admin/mixins/settings-menu-component', 'ghost-admin/utils/bound-one-way', 'ghost-admin/utils/format-markdown', 'moment', 'ember-concurrency'], function (exports, _settingsMenuComponent, _boundOneWay, _formatMarkdown, _moment, _emberConcurrency) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var alias = Ember.computed.alias;
    var or = Ember.computed.or;
    var computed = Ember.computed;
    var htmlSafe = Ember.String.htmlSafe;
    var run = Ember.run;
    var service = Ember.inject.service;


    var PSM_ANIMATION_LENGTH = 400;

    exports.default = Component.extend(_settingsMenuComponent.default, {
        selectedAuthor: null,
        authors: [],

        store: service(),
        config: service(),
        ghostPaths: service(),
        notifications: service(),
        slugGenerator: service(),
        session: service(),
        settings: service(),
        ui: service(),

        model: null,

        customExcerptScratch: alias('model.customExcerptScratch'),
        codeinjectionFootScratch: alias('model.codeinjectionFootScratch'),
        codeinjectionHeadScratch: alias('model.codeinjectionHeadScratch'),
        metaDescriptionScratch: alias('model.metaDescriptionScratch'),
        metaTitleScratch: alias('model.metaTitleScratch'),
        ogDescriptionScratch: alias('model.ogDescriptionScratch'),
        ogTitleScratch: alias('model.ogTitleScratch'),
        twitterDescriptionScratch: alias('model.twitterDescriptionScratch'),
        twitterTitleScratch: alias('model.twitterTitleScratch'),
        slugValue: (0, _boundOneWay.default)('model.slug'),

        facebookDescription: or('ogDescriptionScratch', 'customExcerptScratch', 'seoDescription'),
        facebookImage: or('model.ogImage', 'model.featureImage'),
        facebookTitle: or('ogTitleScratch', 'seoTitle'),
        seoTitle: or('metaTitleScratch', 'model.titleScratch'),
        twitterDescription: or('twitterDescriptionScratch', 'customExcerptScratch', 'seoDescription'),
        twitterImage: or('model.twitterImage', 'model.featureImage'),
        twitterTitle: or('twitterTitleScratch', 'seoTitle'),

        _showSettingsMenu: false,
        _showThrobbers: false,

        didReceiveAttrs: function didReceiveAttrs() {
            var _this = this;

            this._super.apply(this, arguments);

            this.get('store').query('user', { limit: 'all' }).then(function (users) {
                if (!_this.get('isDestroyed')) {
                    _this.set('authors', users.sortBy('name'));
                }
            });

            this.get('model.author').then(function (author) {
                _this.set('selectedAuthor', author);
            });

            // HACK: ugly method of working around the CSS animations so that we
            // can add throbbers only when the animation has finished
            // TODO: use liquid-fire to handle PSM slide-in and replace tabs manager
            // with something more ember-like
            if (this.get('showSettingsMenu') && !this._showSettingsMenu) {
                this.get('showThrobbers').perform();
            }

            // fired when menu is closed
            if (!this.get('showSettingsMenu') && this._showSettingsMenu) {
                var post = this.get('model');
                var errors = post.get('errors');

                // reset the publish date if it has an error
                if (errors.has('publishedAtBlogDate') || errors.has('publishedAtBlogTime')) {
                    post.set('publishedAtBlogTZ', post.get('publishedAtUTC'));
                    post.validate({ attribute: 'publishedAtBlog' });
                }

                // remove throbbers
                this.set('_showThrobbers', false);
            }

            this._showSettingsMenu = this.get('showSettingsMenu');
        },


        twitterImageStyle: computed('twitterImage', function () {
            var image = this.get('twitterImage');
            return htmlSafe('background-image: url(' + image + ')');
        }),

        facebookImageStyle: computed('facebookImage', function () {
            var image = this.get('facebookImage');
            return htmlSafe('background-image: url(' + image + ')');
        }),

        showThrobbers: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return (0, _emberConcurrency.timeout)(PSM_ANIMATION_LENGTH);

                        case 2:
                            this.set('_showThrobbers', true);

                        case 3:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        })).restartable(),

        seoDescription: computed('model.scratch', 'metaDescriptionScratch', function () {
            var metaDescription = this.get('metaDescriptionScratch') || '';
            var mobiledoc = this.get('model.scratch');
            var markdown = mobiledoc.cards && mobiledoc.cards[0][1].markdown;
            var placeholder = void 0;

            if (metaDescription) {
                placeholder = metaDescription;
            } else {
                var div = document.createElement('div');
                div.innerHTML = (0, _formatMarkdown.default)(markdown, false);

                // Strip HTML
                placeholder = div.textContent;
                // Replace new lines and trim
                placeholder = placeholder.replace(/\n+/g, ' ').trim();
            }

            return placeholder;
        }),

        seoURL: computed('model.slug', 'config.blogUrl', function () {
            var blogUrl = this.get('config.blogUrl');
            var seoSlug = this.get('model.slug') ? this.get('model.slug') : '';
            var seoURL = blogUrl + '/' + seoSlug;

            // only append a slash to the URL if the slug exists
            if (seoSlug) {
                seoURL += '/';
            }

            return seoURL;
        }),

        showError: function showError(error) {
            // TODO: remove null check once ValidationEngine has been removed
            if (error) {
                this.get('notifications').showAPIError(error);
            }
        },


        actions: {
            showSubview: function showSubview(subview) {
                this._super.apply(this, arguments);

                this.set('subview', subview);

                // Chrome appears to have an animation bug that cancels the slide
                // transition unless there's a delay between the animation starting
                // and the throbbers being removed
                run.later(this, function () {
                    this.set('_showThrobbers', false);
                }, 50);
            },
            closeSubview: function closeSubview() {
                this._super.apply(this, arguments);

                this.set('subview', null);
                this.get('showThrobbers').perform();
            },
            discardEnter: function discardEnter() {
                return false;
            },
            togglePage: function togglePage() {
                var _this2 = this;

                this.toggleProperty('model.page');

                // If this is a new post.  Don't save the model.  Defer the save
                // to the user pressing the save button
                if (this.get('model.isNew')) {
                    return;
                }

                this.get('savePost').perform().catch(function (error) {
                    _this2.showError(error);
                    _this2.get('model').rollbackAttributes();
                });
            },
            toggleFeatured: function toggleFeatured() {
                var _this3 = this;

                this.toggleProperty('model.featured');

                // If this is a new post.  Don't save the model.  Defer the save
                // to the user pressing the save button
                if (this.get('model.isNew')) {
                    return;
                }

                this.get('savePost').perform().catch(function (error) {
                    _this3.showError(error);
                    _this3.get('model').rollbackAttributes();
                });
            },


            /**
             * triggered by user manually changing slug
             */
            updateSlug: function updateSlug(newSlug) {
                var _this4 = this;

                return this.get('updateSlug').perform(newSlug).catch(function (error) {
                    _this4.showError(error);
                    _this4.get('model').rollbackAttributes();
                });
            },
            setPublishedAtBlogDate: function setPublishedAtBlogDate(date) {
                var post = this.get('model');
                var dateString = (0, _moment.default)(date).format('YYYY-MM-DD');

                post.get('errors').remove('publishedAtBlogDate');

                if (post.get('isNew') || date === post.get('publishedAtBlogDate')) {
                    post.validate({ property: 'publishedAtBlog' });
                } else {
                    post.set('publishedAtBlogDate', dateString);
                    return this.get('savePost').perform();
                }
            },
            setPublishedAtBlogTime: function setPublishedAtBlogTime(time) {
                var post = this.get('model');

                post.get('errors').remove('publishedAtBlogDate');

                if (post.get('isNew') || time === post.get('publishedAtBlogTime')) {
                    post.validate({ property: 'publishedAtBlog' });
                } else {
                    post.set('publishedAtBlogTime', time);
                    return this.get('savePost').perform();
                }
            },
            setCustomExcerpt: function setCustomExcerpt(excerpt) {
                var _this5 = this;

                var model = this.get('model');
                var currentExcerpt = model.get('customExcerpt');

                if (excerpt === currentExcerpt) {
                    return;
                }

                model.set('customExcerpt', excerpt);

                return model.validate({ property: 'customExcerpt' }).then(function () {
                    return _this5.get('savePost').perform();
                });
            },
            setHeaderInjection: function setHeaderInjection(code) {
                var _this6 = this;

                var model = this.get('model');
                var currentCode = model.get('codeinjectionHead');

                if (code === currentCode) {
                    return;
                }

                model.set('codeinjectionHead', code);

                return model.validate({ property: 'codeinjectionHead' }).then(function () {
                    return _this6.get('savePost').perform();
                });
            },
            setFooterInjection: function setFooterInjection(code) {
                var _this7 = this;

                var model = this.get('model');
                var currentCode = model.get('codeinjectionFoot');

                if (code === currentCode) {
                    return;
                }

                model.set('codeinjectionFoot', code);

                return model.validate({ property: 'codeinjectionFoot' }).then(function () {
                    return _this7.get('savePost').perform();
                });
            },
            setMetaTitle: function setMetaTitle(metaTitle) {
                var _this8 = this;

                // Grab the model and current stored meta title
                var model = this.get('model');
                var currentTitle = model.get('metaTitle');

                // If the title entered matches the stored meta title, do nothing
                if (currentTitle === metaTitle) {
                    return;
                }

                // If the title entered is different, set it as the new meta title
                model.set('metaTitle', metaTitle);

                // Make sure the meta title is valid and if so, save it into the model
                return model.validate({ property: 'metaTitle' }).then(function () {
                    if (model.get('isNew')) {
                        return;
                    }

                    return _this8.get('savePost').perform();
                });
            },
            setMetaDescription: function setMetaDescription(metaDescription) {
                var _this9 = this;

                // Grab the model and current stored meta description
                var model = this.get('model');
                var currentDescription = model.get('metaDescription');

                // If the title entered matches the stored meta title, do nothing
                if (currentDescription === metaDescription) {
                    return;
                }

                // If the title entered is different, set it as the new meta title
                model.set('metaDescription', metaDescription);

                // Make sure the meta title is valid and if so, save it into the model
                return model.validate({ property: 'metaDescription' }).then(function () {
                    if (model.get('isNew')) {
                        return;
                    }

                    return _this9.get('savePost').perform();
                });
            },
            setOgTitle: function setOgTitle(ogTitle) {
                var _this10 = this;

                // Grab the model and current stored facebook title
                var model = this.get('model');
                var currentTitle = model.get('ogTitle');

                // If the title entered matches the stored facebook title, do nothing
                if (currentTitle === ogTitle) {
                    return;
                }

                // If the title entered is different, set it as the new facebook title
                model.set('ogTitle', ogTitle);

                // Make sure the facebook title is valid and if so, save it into the model
                return model.validate({ property: 'ogTitle' }).then(function () {
                    if (model.get('isNew')) {
                        return;
                    }

                    return _this10.get('savePost').perform();
                });
            },
            setOgDescription: function setOgDescription(ogDescription) {
                var _this11 = this;

                // Grab the model and current stored facebook description
                var model = this.get('model');
                var currentDescription = model.get('ogDescription');

                // If the title entered matches the stored facebook description, do nothing
                if (currentDescription === ogDescription) {
                    return;
                }

                // If the description entered is different, set it as the new facebook description
                model.set('ogDescription', ogDescription);

                // Make sure the facebook description is valid and if so, save it into the model
                return model.validate({ property: 'ogDescription' }).then(function () {
                    if (model.get('isNew')) {
                        return;
                    }

                    return _this11.get('savePost').perform();
                });
            },
            setTwitterTitle: function setTwitterTitle(twitterTitle) {
                var _this12 = this;

                // Grab the model and current stored twitter title
                var model = this.get('model');
                var currentTitle = model.get('twitterTitle');

                // If the title entered matches the stored twitter title, do nothing
                if (currentTitle === twitterTitle) {
                    return;
                }

                // If the title entered is different, set it as the new twitter title
                model.set('twitterTitle', twitterTitle);

                // Make sure the twitter title is valid and if so, save it into the model
                return model.validate({ property: 'twitterTitle' }).then(function () {
                    if (model.get('isNew')) {
                        return;
                    }

                    return _this12.get('savePost').perform();
                });
            },
            setTwitterDescription: function setTwitterDescription(twitterDescription) {
                var _this13 = this;

                // Grab the model and current stored twitter description
                var model = this.get('model');
                var currentDescription = model.get('twitterDescription');

                // If the description entered matches the stored twitter description, do nothing
                if (currentDescription === twitterDescription) {
                    return;
                }

                // If the description entered is different, set it as the new twitter description
                model.set('twitterDescription', twitterDescription);

                // Make sure the twitter description is valid and if so, save it into the model
                return model.validate({ property: 'twitterDescription' }).then(function () {
                    if (model.get('isNew')) {
                        return;
                    }

                    return _this13.get('savePost').perform();
                });
            },
            setCoverImage: function setCoverImage(image) {
                var _this14 = this;

                this.set('model.featureImage', image);

                if (this.get('model.isNew')) {
                    return;
                }

                this.get('savePost').perform().catch(function (error) {
                    _this14.showError(error);
                    _this14.get('model').rollbackAttributes();
                });
            },
            clearCoverImage: function clearCoverImage() {
                var _this15 = this;

                this.set('model.featureImage', '');

                if (this.get('model.isNew')) {
                    return;
                }

                this.get('savePost').perform().catch(function (error) {
                    _this15.showError(error);
                    _this15.get('model').rollbackAttributes();
                });
            },
            setOgImage: function setOgImage(image) {
                var _this16 = this;

                this.set('model.ogImage', image);

                if (this.get('model.isNew')) {
                    return;
                }

                this.get('savePost').perform().catch(function (error) {
                    _this16.showError(error);
                    _this16.get('model').rollbackAttributes();
                });
            },
            clearOgImage: function clearOgImage() {
                var _this17 = this;

                this.set('model.ogImage', '');

                if (this.get('model.isNew')) {
                    return;
                }

                this.get('savePost').perform().catch(function (error) {
                    _this17.showError(error);
                    _this17.get('model').rollbackAttributes();
                });
            },
            setTwitterImage: function setTwitterImage(image) {
                var _this18 = this;

                this.set('model.twitterImage', image);

                if (this.get('model.isNew')) {
                    return;
                }

                this.get('savePost').perform().catch(function (error) {
                    _this18.showError(error);
                    _this18.get('model').rollbackAttributes();
                });
            },
            clearTwitterImage: function clearTwitterImage() {
                var _this19 = this;

                this.set('model.twitterImage', '');

                if (this.get('model.isNew')) {
                    return;
                }

                this.get('savePost').perform().catch(function (error) {
                    _this19.showError(error);
                    _this19.get('model').rollbackAttributes();
                });
            },
            changeAuthor: function changeAuthor(newAuthor) {
                var _this20 = this;

                var author = this.get('model.author');
                var model = this.get('model');

                // return if nothing changed
                if (newAuthor.get('id') === author.get('id')) {
                    return;
                }

                model.set('author', newAuthor);

                // if this is a new post (never been saved before), don't try to save it
                if (this.get('model.isNew')) {
                    return;
                }

                this.get('savePost').perform().catch(function (error) {
                    _this20.showError(error);
                    _this20.set('selectedAuthor', author);
                    model.rollbackAttributes();
                });
            },
            deletePost: function deletePost() {
                if (this.get('deletePost')) {
                    this.get('deletePost')();
                }
            }
        }
    });
});