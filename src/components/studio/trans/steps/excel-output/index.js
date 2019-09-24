/* eslint semi: ["error", "always"] */
import ExcelOutput from './excel-output.vue';

/* istanbul ignore next */
ExcelOutput.install = function (Vue) {
  Vue.component(ExcelOutput.name, ExcelOutput);
};

export default ExcelOutput;
