/* eslint semi: ["error", "always"] */
import CsvOutput from './csv-output.vue';

/* istanbul ignore next */
CsvOutput.install = function (Vue) {
  Vue.component(CsvOutput.name, CsvOutput);
};

export default CsvOutput;
