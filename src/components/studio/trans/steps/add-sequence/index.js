/* eslint semi: ["error", "always"] */
import Sequence from './add-sequence.vue';

/* istanbul ignore next */
Sequence.install = function (Vue) {
  Vue.component(Sequence.name, Sequence);
};

export default Sequence;
