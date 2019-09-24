/* eslint semi: ["error", "always"] */
import ReplaceString from './replace-string.vue';

/* istanbul ignore next */
ReplaceString.install = function (Vue) {
  Vue.component(ReplaceString.name, ReplaceString);
};

export default ReplaceString;
