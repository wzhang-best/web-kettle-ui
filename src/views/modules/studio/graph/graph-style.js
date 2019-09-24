/**
 * 修改mxGraph样式
 */
/* eslint semi: ["error", "always"] */
/* eslint-disable no-new-object */
import mxgraph from '@/views/modules/studio/graph/index.js';
import * as global from '@/views/modules/studio/common/common.js';
const {
  mxConstants,
  mxPerimeter
} = mxgraph;
export function configureStylesheet (graph) {
  var style = new Object();
  style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
  style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
  style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
  // style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
  // style[mxConstants.STYLE_GRADIENTCOLOR] = '#41B9F5';
  // style[mxConstants.STYLE_FILLCOLOR] = '#8CCDF5';
  // style[mxConstants.STYLE_STROKECOLOR] = '#1B78C8';
  // style[mxConstants.STYLE_FONTCOLOR] = '#000000';
  // style[mxConstants.STYLE_ROUNDED] = true;
  // style[mxConstants.STYLE_OPACITY] = '80';
  style[mxConstants.STYLE_FONTSIZE] = '12';
  style[mxConstants.STYLE_FONTSTYLE] = 0;
  // style[mxConstants.STYLE_IMAGE_WIDTH] = '16';
  // style[mxConstants.STYLE_IMAGE_HEIGHT] = '16';
  style[mxConstants.VERTEX_SELECTION_COLOR] = 'black';
  // style[mxConstants.HANDLE_FILLCOLOR] = 'black';
  // style[mxConstants.DEFAULT_VALID_COLOR] = 'black';
  style[mxConstants.VERTEX_SELECTION_DASHED] = false;
  style[mxConstants.VERTEX_SELECTION_STROKEWIDTH] = '5';
  graph.getStylesheet().putDefaultVertexStyle(style);

  // 组件之间的连线样式
  var defaultedgeStyle = new Object();
  // style = graph.getStylesheet().getDefaultEdgeStyle();
  defaultedgeStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_CONNECTOR;
  defaultedgeStyle[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_CLASSIC;
  defaultedgeStyle[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
  defaultedgeStyle[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
  defaultedgeStyle[mxConstants.STYLE_STROKEWIDTH] = '2';
  defaultedgeStyle[mxConstants.EDGE_SELECTION_STROKEWIDTH] = '3';
  defaultedgeStyle[mxConstants.EDGE_SELECTION_COLOR] = '#5b7c93';
  defaultedgeStyle[mxConstants.STYLE_FONTCOLOR] = '#446299';
  graph.getStylesheet().putDefaultEdgeStyle(defaultedgeStyle);

  var edgeStyle = new Object();
  // style = graph.getStylesheet().getDefaultEdgeStyle();
  edgeStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_CONNECTOR;
  edgeStyle[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_CLASSIC;
  edgeStyle[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
  edgeStyle[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
  edgeStyle[mxConstants.STYLE_STROKEWIDTH] = '2';
  edgeStyle[mxConstants.STYLE_STROKECOLOR] = '#5b7c93';
  edgeStyle[mxConstants.EDGE_SELECTION_STROKEWIDTH] = '3';
  edgeStyle[mxConstants.EDGE_SELECTION_COLOR] = '#5b7c93';
  edgeStyle[mxConstants.STYLE_FONTCOLOR] = '#446299';
  graph.getStylesheet().putCellStyle('hop', edgeStyle);

  var edgeStyleDisable = new Object();
  edgeStyleDisable[mxConstants.STYLE_STROKECOLOR] = '#CCC';
  graph.getStylesheet().putCellStyle('disabled', edgeStyleDisable);

  var edgeStyleEvaluationY = new Object();
  edgeStyleEvaluationY[mxConstants.STYLE_STROKECOLOR] = 'green';
  graph.getStylesheet().putCellStyle('evaluation-true', edgeStyleEvaluationY);

  var edgeStyleEvaluationN = new Object();
  edgeStyleEvaluationN[mxConstants.STYLE_STROKECOLOR] = 'red';
  graph.getStylesheet().putCellStyle('evaluation-false', edgeStyleEvaluationN);

  // 注解组件样式
  style = new Object();
  style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_LABEL;
  style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
  // style[mxConstants.STYLE_VERTICAL_LABEL_POSITION] = 'bottom';
  // style[mxConstants.STYLE_VERTICAL_ALIGN] = 'top';
  style[mxConstants.STYLE_STROKECOLOR] = '#5b7c93';
  style[mxConstants.STYLE_STROKEWIDTH] = '1';
  style[mxConstants.STYLE_FILLCOLOR] = 'orange';
  graph.getStylesheet().putCellStyle('note', style);
};
// 组件图片样式
export function configurePluginImageStyle (graph) {
  // 定义锚点默认图片
  var portStyle = new Object();
  portStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
  graph.getStylesheet().putCellStyle('port', portStyle);
  // 锚点 input样式
  var portInputStyle = new Object(); // mxUtils.clone(style);
  portInputStyle[mxConstants.STYLE_IMAGE] = `${global.PLUGIN_INPUT_IMAGE}`;
  graph.getStylesheet().putCellStyle('port-input', portInputStyle);
  // 锚点 output样式
  var portOutputStyle = new Object(); // mxUtils.clone(style);
  portOutputStyle[mxConstants.STYLE_IMAGE] = `${global.PLUGIN_OUTPUT_IMAGE}`;
  graph.getStylesheet().putCellStyle('port-output', portOutputStyle);

  // 定义转换组件图片默认样式
  var stepStyle = new Object();
  stepStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_LABEL;
  stepStyle[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
  stepStyle[mxConstants.STYLE_IMAGE_ALIGN] = mxConstants.ALIGN_CENTER;
  stepStyle[mxConstants.STYLE_IMAGE_VERTICAL_ALIGN] = mxConstants.ALIGN_CENTER;
  stepStyle[mxConstants.STYLE_IMAGE_WIDTH] = '32';
  stepStyle[mxConstants.STYLE_IMAGE_HEIGHT] = '32';
  stepStyle[mxConstants.STYLE_VERTICAL_LABEL_POSITION] = 'bottom';
  stepStyle[mxConstants.STYLE_VERTICAL_ALIGN] = 'top';
  stepStyle[mxConstants.STYLE_STROKECOLOR] = '#5b7c93';
  stepStyle[mxConstants.STYLE_STROKEWIDTH] = '2';
  graph.getStylesheet().putCellStyle('step', stepStyle);
  // 定义作业组件图片默认样式
  var entryStyle = new Object();
  entryStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_LABEL;
  entryStyle[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
  entryStyle[mxConstants.STYLE_IMAGE_ALIGN] = mxConstants.ALIGN_CENTER;
  entryStyle[mxConstants.STYLE_IMAGE_VERTICAL_ALIGN] = mxConstants.ALIGN_CENTER;
  entryStyle[mxConstants.STYLE_IMAGE_WIDTH] = '32';
  entryStyle[mxConstants.STYLE_IMAGE_HEIGHT] = '32';
  entryStyle[mxConstants.STYLE_VERTICAL_LABEL_POSITION] = 'bottom';
  entryStyle[mxConstants.STYLE_VERTICAL_ALIGN] = 'top';
  entryStyle[mxConstants.STYLE_STROKECOLOR] = '#5b7c93';
  entryStyle[mxConstants.STYLE_STROKEWIDTH] = '2';
  graph.getStylesheet().putCellStyle('entry', entryStyle);
  // 转换样式
  const transImages = require('../common/trans-images.json');
  for (let i = 0; i < transImages.length; i++) {
    var transStyle = new Object();
    transStyle[mxConstants.STYLE_IMAGE] = `${global.IMAGE_PATH}${transImages[i].image}`;
    graph.getStylesheet().putCellStyle('trans-' + transImages[i].pluginId, transStyle);
  }
  // 作业样式
  const jobImages = require('../common/job-images.json');
  for (let j = 0; j < jobImages.length; j++) {
    var jobStyle = new Object();
    jobStyle[mxConstants.STYLE_IMAGE] = `${global.IMAGE_PATH}${jobImages[j].image}`;
    graph.getStylesheet().putCellStyle('job-' + jobImages[j].pluginId, jobStyle);
  }
};
