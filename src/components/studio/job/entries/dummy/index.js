/* eslint semi: ["error", "always"] */
import Dummy from './dummy.vue';

/* istanbul ignore next */
Dummy.install = function (Vue) {
  Vue.component(Dummy.name, Dummy);
};

export default Dummy;
