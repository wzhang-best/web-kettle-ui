/* eslint semi: ["error", "always"] */
import Start from './start.vue';

/* istanbul ignore next */
Start.install = function (Vue) {
  Vue.component(Start.name, Start);
};

export default Start;
