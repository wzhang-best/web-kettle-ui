/* eslint semi: ["error", "always"] */
import Constant from './constant.vue';

/* istanbul ignore next */
Constant.install = function (Vue) {
  Vue.component(Constant.name, Constant);
};

export default Constant;
