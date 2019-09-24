/* eslint semi: ["error", "always"] */
import Success from './success.vue';

/* istanbul ignore next */
Success.install = function (Vue) {
  Vue.component(Success.name, Success);
};

export default Success;
