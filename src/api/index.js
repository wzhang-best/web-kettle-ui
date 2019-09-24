/* eslint semi: ["error", "always"] */
import * as trans from './modules/trans';
import * as job from './modules/job';
import * as repository from './modules/repository';
import * as database from './modules/database';
import * as studio from './modules/studio';

export default {
  trans,      // 转换
  job,        // 作业
  repository, // 资源库
  database,   // 数据源
  studio      // studio控制接口
};
