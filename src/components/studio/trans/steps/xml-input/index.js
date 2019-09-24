/* eslint semi: ["error", "always"] */
import XMLInputStream from './xml-input.vue';

/* istanbul ignore next */
XMLInputStream.install = function (Vue) {
  Vue.component(XMLInputStream.name, XMLInputStream);
};

export default XMLInputStream;
