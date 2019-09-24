/* eslint semi: ["error", "always"] */
import XmlOutput from './xml-output.vue';

/* istanbul ignore next */
XmlOutput.install = function (Vue) {
  Vue.component(XmlOutput.name, XmlOutput);
};

export default XmlOutput;
