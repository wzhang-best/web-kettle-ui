/* eslint semi: ["error", "always"] */
import CsvInput from './csv-input.vue';

/* istanbul ignore next */
CsvInput.install = function (Vue) {
  Vue.component(CsvInput.name, CsvInput);
};

export default CsvInput;
