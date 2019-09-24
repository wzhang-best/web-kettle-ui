/* eslint semi: ["error", "always"] */
import SelectValues from './select-values.vue';

/* istanbul ignore next */
SelectValues.install = function (Vue) {
  Vue.component(SelectValues.name, SelectValues);
};

export default SelectValues;
