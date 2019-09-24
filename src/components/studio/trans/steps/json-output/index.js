/* eslint semi: ["error", "always"] */
import JsonOutput from './json-output.vue';

/* istanbul ignore next */
JsonOutput.install = function (Vue) {
  Vue.component(JsonOutput.name, JsonOutput);
};

export default JsonOutput;
