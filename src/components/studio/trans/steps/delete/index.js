/* eslint semi: ["error", "always"] */
import Delete from './delete.vue';

/* istanbul ignore next */
Delete.install = function (Vue) {
  Vue.component(Delete.name, Delete);
};

export default Delete;
