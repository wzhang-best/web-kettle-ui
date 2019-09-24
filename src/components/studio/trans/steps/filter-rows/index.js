/* eslint semi: ["error", "always"] */
import FilterRows from './filter-rows.vue';

/* istanbul ignore next */
FilterRows.install = function (Vue) {
  Vue.component(FilterRows.name, FilterRows);
};

export default FilterRows;
