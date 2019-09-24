/* eslint semi: ["error", "always"] */
/* eslint-disable new-cap */
/**
 * 公用js方法
 */
import mxgraph from '@/views/modules/studio/graph/index.js';
// 全局常量
import * as global from '@/views/modules/studio/common/common.js';
// 访问后台api
import API from '@/api';
const {
  mxCodec,
  mxUtils,
  mxCellOverlay,
  mxImage
  // mxDragSource,
  // mxPoint,
  // mxGeometry,
  // mxCell
} = mxgraph;
/**
 * 获取mxGraph生成的xml
 * @param {Object} graph MxGraph对象
 */
export function getMxGraphXml (graph) {
  const enc = new mxCodec(mxUtils.createXmlDocument());
  const node = enc.encode(graph.getModel());
  const value = mxUtils.getPrettyXml(node);
  return value;
}
/**
 * 清除组件上的状态图标
 * @param {Object} graph MxGraph对象
 */
export async function clearPluginOverlays (graph) {
  // 获取画布上的所有组件
  const parent = graph.getDefaultParent();
  const cells = parent.children;
  if (cells !== null && cells.length > 0) {
    for (let j = 0; j < cells.length; j++) {
      const cell = cells[j];
      if (!cell.edge) {
        graph.removeCellOverlays(cell);
      }
    }
  }
};
// 执行流程后改变组件状态
export async function changePluginState (statusData, graph) {
  // 获取画布上所有组件
  const parent = graph.getDefaultParent();
  const cells = parent.children;
  // 循环匹配组件
  if (statusData.length > 0) {
    for (let i = 0; i < statusData.length; i++) {
      const data = statusData[i];
      if (cells.length > 0) {
        for (let j = 0; j < cells.length; j++) {
          const cell = cells[j];
          if (!cell.edge) {
            if (cell.getAttribute(global.ELEMENT_DEFAULT_ATTRIBUTE_NAME) === data.name) {
              let overlays = graph.getCellOverlays(cell);
              // 根据状态值画状态图标
              if (data.status === 0) {
                overlays = new mxCellOverlay(
                  new mxImage(global.PLUGIN_STATE_IMAGE_TRUE, 16, 16), '');
                // 鼠标样式
                overlays.cursor = 'move';
                graph.addCellOverlay(cell, overlays);
              } else if (data.status > 0) {
                overlays = new mxCellOverlay(
                  new mxImage(global.PLUGIN_STATE_IMAGE_FALSE, 16, 16), '');
                // 鼠标样式
                overlays.cursor = 'move';
                graph.addCellOverlay(cell, overlays);
              } else {
                graph.removeCellOverlays(cell);
              }
            }
          }
        }
      }
    }
  }
};
// 根据属性设置作业连线样式
export function setEdge (graph, currentModel, edge, enabled) {
  if (currentModel === global.TRANS_MODEL) {
    setTransEdge(graph, edge, enabled);
  } else {
    setJobEdge(graph, edge, enabled);
  }
}
/**
 * 设置转换连线样式
 * @param {Object} graph mxGRaph对象
 * @param {Object} edge 连线对象
 * @param {Object} enabled 连线有效属性
 */
function setTransEdge (graph, edge, enabled) {
  if (enabled === global.EDGE_ELEMENT_ATTRIBUTE_ENABLED_TRUE_VALUE) { // enabled=Y
    edge.style = 'hop';
  } else {
    edge.style = 'hop;disabled';
  }
  graph.refresh(edge);
}
/**
 * 设置作业连线样式
 * @param {Object} graph mxGRaph对象
 * @param {Object} edge 连线对象
 * @param {Object} enabled 连线有效属性
 */
function setJobEdge (graph, edge, enabled) {
  const evaluation = edge.getAttribute('evaluation');
  const unconditional = edge.getAttribute('unconditional');
  if (enabled === global.EDGE_ELEMENT_ATTRIBUTE_ENABLED_TRUE_VALUE) {
    if (unconditional === global.EDGE_ELEMENT_ATTRIBUTE_EVALUATION_FALSE_VALUE) {
      if (evaluation === global.EDGE_ELEMENT_ATTRIBUTE_EVALUATION_TRUE_VALUE) {
        // 设置先为绿色
        edge.style = 'hop;evaluation-true';
      } else {
        // 设置线为红色
        edge.style = 'hop;evaluation-false';
      }
    } else {
      // 设置线为黑色
      edge.style = 'hop;';
    }
  } else {
    // 设置线为灰色
    edge.style = 'hop;disabled';
  }
  graph.refresh(edge);
}
/**
 * 组件上的data字符串值转成对象
 */
export function pluginValueToObject (cell) {
  let jsonObj = null;
  if (cell.value.innerHTML) {
    var tempNodeStr = cell.value.innerHTML;
    let textNode = new DOMParser().parseFromString(tempNodeStr, 'text/html').body.childNodes[0];
    let currentData = textNode.getAttribute(global.SAVE_FORMDATA_ELEMENT_ATTRIBUTE);
    jsonObj = JSON.parse(currentData);
  }
  return jsonObj;
}
// 获取转换的xml
export function getTransXml (path, name) {
  var params = {
    'path': path,
    'name': name
  };
  const result = API.repository.trans(params);
  return result;
}
// 获取job的xml
export function getJobXml (path, name) {
  var params = {
    'path': path,
    'name': name
  };
  const result = API.repository.jobs(params);
  return result;
}
