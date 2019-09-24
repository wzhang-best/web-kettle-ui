/* eslint semi: ["error", "always"] */
import Trans from './trans.vue';

/* istanbul ignore next */
Trans.install = function (Vue) {
  Vue.component(Trans.name, Trans);
};

export default Trans;
