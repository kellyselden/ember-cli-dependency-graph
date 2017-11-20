define('ember-light-table/components/lt-head', ['exports', 'ember', 'ember-light-table/templates/components/lt-head', 'ember-light-table/mixins/table-header'], function (exports, _ember, _emberLightTableTemplatesComponentsLtHead, _emberLightTableMixinsTableHeader) {
  var assert = _ember['default'].assert;
  var Component = _ember['default'].Component;
  var isEmpty = _ember['default'].isEmpty;
  var set = _ember['default'].set;

  /**
   * @module Light Table
   */

  /**
   * ```hbs
   * {{#light-table table as |t|}}
   *   {{t.head onColumnClick=(action 'sortByColumn')}}
   * {{/light-table}}
   * ```
   *
   * If you want to define your own thead, just declare the contextual component in a block.
   *
   * ```hbs
   * {{#light-table table as |t|}}
   *   {{#t.head onColumnClick=(action 'sortByColumn') as |groups subColumns|}}
   *     {{#each groups as |group|}}
   *       {{!-- ... --}}
   *     {{/each}}
   *   {{/t.head}}
   * {{/light-table}}
   * ```
   *
   * If you dont have grouped columns, the yielded `groups` will be an array of all visibile columns and `subColumns`
   * will be empty
   *
   * @class t.head
   * @uses TableHeaderMixin
   */

  exports['default'] = Component.extend(_emberLightTableMixinsTableHeader['default'], {
    layout: _emberLightTableTemplatesComponentsLtHead['default'],
    classNames: ['lt-head-wrap'],
    table: null,
    sharedOptions: null,

    init: function init() {
      this._super.apply(this, arguments);

      var sharedOptions = this.get('sharedOptions') || {};
      var fixed = this.get('fixed');

      assert('[ember-light-table] The height property is required for fixed header', !fixed || fixed && !isEmpty(sharedOptions.height));

      set(sharedOptions, 'fixedHeader', fixed);
    }
  });
});