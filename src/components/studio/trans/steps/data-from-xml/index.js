/* eslint semi: ["error", "always"] */
import GetXMLData from './data-from-xml.vue';

/* istanbul ignore next */
GetXMLData.install = function (Vue) {
  Vue.component(GetXMLData.name, GetXMLData);
};

export default GetXMLData;
