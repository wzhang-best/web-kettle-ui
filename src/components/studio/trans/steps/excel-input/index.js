/* eslint semi: ["error", "always"] */
import ExcelInput from './excel-input.vue';

/* istanbul ignore next */
ExcelInput.install = function (Vue) {
  Vue.component(ExcelInput.name, ExcelInput);
};

export default ExcelInput;
