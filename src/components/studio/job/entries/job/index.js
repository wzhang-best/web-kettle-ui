/* eslint semi: ["error", "always"] */
import Job from './job.vue';

/* istanbul ignore next */
Job.install = function (Vue) {
  Vue.component(Job.name, Job);
};

export default Job;
