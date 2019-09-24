/* eslint semi: ["error", "always"] */
// 图片路径
export const IMAGE_PATH = `/${window.SITE_CONFIG.cdnUrl}/static/studio/images/`;
// export const IMAGE_PATH = `/static/studio/images/`;

// 模式类型
export const TRANS_MODEL = 'transformation';
export const JOB_MODEL = 'job';
export const DIRECTORY_MODEL = 'directory';

// 自定义标签名称
export const TRANS_ELEMENT = 'step'; // 转换标签
export const JOB_ELEMENT = 'entry'; // 作业标签
export const EDGE_ELEMENT = 'hop'; // 连线标签
export const NOTE_ELEMENT = 'notepad'; // 注解标签
export const PARENT_ELEMENT = 'info'; // 父标签
export const SAVE_FORMDATA_ELEMENT = 'data'; // 保存数据的标签

// 自定义标签默认属性
export const ELEMENT_DEFAULT_ATTRIBUTE_NAME = 'name';
export const ELEMENT_DEFAULT_ATTRIBUTE_NOTE = 'note';
export const ELEMENT_DEFAULT_ATTRIBUTE_TYPE = 'type';
export const ELEMENT_DEFAULT_ATTRIBUTE_PLUGIN_ID = 'pluginId';
export const ELEMENT_DEFAULT_ATTRIBUTE_DESCRIPTION = 'description';
export const ELEMENT_DEFAULT_ATTRIBUTE_DISTRIBUTE = 'distribute'; // 保存数据发送选项 Y 轮流发送(默认) N 复制发送
export const ELEMENT_DEFAULT_ATTRIBUTE_CUSTOM_DISTRIBUTION = 'custom_distribution';
export const ELEMENT_DEFAULT_ATTRIBUTE_COPIES = 'copies';
export const ELEMENT_DEFAULT_ATTRIBUTE_PARTITIONING = 'partitioning';
export const ELEMENT_DEFAULT_ATTRIBUTE_ATTRIBUTES = 'attributes';
export const ELEMENT_DEFAULT_ATTRIBUTE_CLUSTER_SCHEMA = 'cluster_schema';
export const ELEMENT_DEFAULT_ATTRIBUTE_REMOTESTEPS = 'remotesteps';
export const ELEMENT_DEFAULT_ATTRIBUTE_DRAW = 'draw';
export const SAVE_FORMDATA_ELEMENT_ATTRIBUTE = 'value';

// 自定义连线标签属性
export const EDGE_ELEMENT_ATTRIBUTE_ENABLED = 'enabled';
export const EDGE_ELEMENT_ATTRIBUTE_ENABLED_TRUE_VALUE = 'Y';
export const EDGE_ELEMENT_ATTRIBUTE_ENABLED_FALSE_VALUE = 'N';
// 作业连线上图片显示的控制
export const EDGE_ELEMENT_ATTRIBUTE_EVALUATION = 'evaluation';
export const EDGE_ELEMENT_ATTRIBUTE_EVALUATION_TRUE_VALUE = 'Y';
export const EDGE_ELEMENT_ATTRIBUTE_EVALUATION_FALSE_VALUE = 'N';
// 作业的评价属性
export const EDGE_ELEMENT_ATTRIBUTE_UNCONDITION = 'unconditional';
export const EDGE_ELEMENT_ATTRIBUTE_UNCONDITION_TRUE_VALUE = 'Y';
export const EDGE_ELEMENT_ATTRIBUTE_UNCONDITION_FALSE_VALUE = 'N';
// 作业开始组件名称
export const JOB_PLUGIN_START = 'START';

// 作业连线颜色
export const JOB_EDGE_TRUE_STROKECOLOR = 'GREEN';
export const JOB_EDGE_FALSE_STROKECOLOR = 'RED';

// 自定义连线样式
export const EDGE_ELEMENT_STYLE_DEFAULT_STROKECOLOR = '#5b7c93';
export const EDGE_ELEMENT_STYLE_STROKECOLOR = '#CCC';
export const EDGE_ELEMENT_IMAGE_PATH = IMAGE_PATH + 'copy-hop.png';

// 自定义父标签属性
export const PARENT_ELEMENT_ATTRIBUTE_NAME = 'name';
export const PARENT_ELEMENT_ATTRIBUTE_TYPE = 'type';
export const PARENT_ELEMENT_ATTRIBUTE_DIRECTORY = 'directory';

// 组件上锚点图片
export const PLUGIN_INPUT_IMAGE = IMAGE_PATH + 'hop-input.png';
export const PLUGIN_OUTPUT_IMAGE = IMAGE_PATH + 'hop-output.png';
// 组件上锚点提示
export const PLUGIN_INPUT_TOOLTIP = 'Input';
export const PLUGIN_OUTPUT_TOOLTIP = 'Output';

// 组件上状态图片
export const PLUGIN_STATE_IMAGE_TRUE = IMAGE_PATH + 'true.png';
export const PLUGIN_STATE_IMAGE_FALSE = IMAGE_PATH + 'false.png';
export const PLUGIN_STATE_IMAGE_UNCONDITION = IMAGE_PATH + 'unconditional-hop.png';

// 容器画布图片
export const CONTAINER_IMAGE_PATH = IMAGE_PATH + 'grid.gif';

// 目录图标
export const DIRECTORY_IMAGE_PATH = IMAGE_PATH + 'folder.png';
// 转换图标
export const TRANS_IMAGE_PATH = IMAGE_PATH + 'trans.png';
// 作业图标
export const JOB_IMAGE_PATH = IMAGE_PATH + 'job.png';

// 设置一个字符的宽高
export const CHARACTER_WIDTH = 12;
export const CHARACTER_HEIGHT = 16;

// 度量刷新间隔(毫秒)
export const METRICS_INTERVAL = 1000;

// 鼠标位置
export let MOUSE_PAGEX = '';
export let MOUSE_PAGEY = '';
