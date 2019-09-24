/* eslint semi: ["error", "always"] */
import ValueMapper from './value-mapper.vue';

/* istanbul ignore next */
ValueMapper.install = function (Vue) {
  Vue.component(ValueMapper.name, ValueMapper);
};

export default ValueMapper;
