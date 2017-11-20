define('ember-light-table/components/lt-foot', ['exports', 'ember', 'ember-light-table/templates/components/lt-foot', 'ember-light-table/mixins/table-header'], function (exports, _ember, _emberLightTableTemplatesComponentsLtFoot, _emberLightTableMixinsTableHeader) {
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
   *   {{t.foot onColumnClick=(action 'sortByColumn')}}
   * {{/light-table}}
   * ```
   * If you want to define your own tfoot, just declare the contextual component in a block.
   *
   * ```hbs
   * {{#light-table table as |t|}}
   *   {{#t.foot onColumnClick=(action 'sortByColumn') as |columns table|}}
   *     {{#each columns as |column|}}
   *       {{!-- ... --}}
   *     {{/each}}
   *   {{/t.foot}}
   * {{/light-table}}
   * ```
   *
   * will be empty
   *
   * @class t.foot
   * @uses TableHeaderMixin
   */

  exports['default'] = Component.extend(_emberLightTableMixinsTableHeader['default'], {
    layout: _emberLightTableTemplatesComponentsLtFoot['default'],
    classNames: ['lt-foot-wrap'],
    table: null,
    sharedOptions: null,

    init: function init() {
      this._super.apply(this, arguments);

      var sharedOptions = this.get('sharedOptions') || {};
      var fixed = this.get('fixed');

      assert('[ember-light-table] The height property is required for fixed footer', !fixed || fixed && !isEmpty(sharedOptions.height));

      set(sharedOptions, 'fixedFooter', fixed);
    }
  });
});