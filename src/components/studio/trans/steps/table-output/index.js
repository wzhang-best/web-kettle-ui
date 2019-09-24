/* eslint semi: ["error", "always"] */
import TableOutput from './table-output.vue';

/* istanbul ignore next */
TableOutput.install = function (Vue) {
  Vue.component(TableOutput.name, TableOutput);
};

export default TableOutput;
