/* eslint semi: ["error", "always"] */
import Calculator from './calculator.vue';

/* istanbul ignore next */
Calculator.install = function (Vue) {
  Vue.component(Calculator.name, Calculator);
};

export default Calculator;
