/* eslint semi: ["error", "always"] */
import Unique from './unique-rows.vue';

/* istanbul ignore next */
Unique.install = function (Vue) {
  Vue.component(Unique.name, Unique);
};

export default Unique;
