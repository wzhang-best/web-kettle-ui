/* eslint semi: ["error", "always"] */
import StringOperations from './string-operations.vue';

/* istanbul ignore next */
StringOperations.install = function (Vue) {
  Vue.component(StringOperations.name, StringOperations);
};

export default StringOperations;
