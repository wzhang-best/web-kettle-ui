/* eslint semi: ["error", "always"] */
import CheckSum from './check-sum.vue';

/* istanbul ignore next */
CheckSum.install = function (Vue) {
  Vue.component(CheckSum.name, CheckSum);
};

export default CheckSum;
