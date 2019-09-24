/* eslint semi: ["error", "always"] */
import JsonInput from './json-input.vue';

/* istanbul ignore next */
JsonInput.install = function (Vue) {
  Vue.component(JsonInput.name, JsonInput);
};

export default JsonInput;
