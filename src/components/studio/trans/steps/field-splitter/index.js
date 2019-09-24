/* eslint semi: ["error", "always"] */
import FieldSplitter from './field-splitter.vue';

/* istanbul ignore next */
FieldSplitter.install = function (Vue) {
  Vue.component(FieldSplitter.name, FieldSplitter);
};

export default FieldSplitter;
