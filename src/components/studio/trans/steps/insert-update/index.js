/* eslint semi: ["error", "always"] */
import InsertUpdate from './insert-update.vue';

/* istanbul ignore next */
InsertUpdate.install = function (Vue) {
  Vue.component(InsertUpdate.name, InsertUpdate);
};

export default InsertUpdate;
