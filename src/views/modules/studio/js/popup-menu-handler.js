/* eslint semi: ["error", "always"] */
/* eslint-disable new-cap */
/**
 * 右键事件
 */
import mxgraph from '@/views/modules/studio/graph/index.js';
// 全局常量
import * as global from '@/views/modules/studio/common/common.js';
// 公共方法
import * as studio from '@/views/modules/studio/js/studio-handler.js';
// 接口api
import API from '@/api';
const {
  mxCellOverlay,
  mxImage,
  mxCodec,
  mxUtils
} = mxgraph;
let _self = null;
let graph = null;
let currentCell = null; // 当前点击的组件
export function setGraph (value) {
  graph = value;
};
export function setThis (value) {
  _self = value;
};
export function setCurrentCell (value) {
  currentCell = value;
}
// 组件上右键=======================================================
// 删除步骤
export function deleteStep () {
  const cells = graph.getSelectionCells();
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    if (cell.value.tagName === global.TRANS_ELEMENT || cell.value.tagName === global.JOB_ELEMENT) {
      // 删除组件
      graph.removeCells([cell], true);
    }
    // 删除map中记录的组件名称
    const cellName = cell.getAttribute(global.ELEMENT_DEFAULT_ATTRIBUTE_NAME);
    _self.tab.refObj.pluginNameMap.delete(cellName);
  }
}
// 编辑步骤
export function editStep () {
  _self.editPluginByDoubleClick(currentCell);
}
// 查看输入字段
export function showInputFields () {
  const enc = new mxCodec(mxUtils.createXmlDocument());
  const node = enc.encode(graph.getModel());
  const value = mxUtils.getPrettyXml(node);
  const stepName = currentCell.getAttribute('name');
  const params = {
    'stepName': stepName
  };
  API.trans.inputFields(value, params)
    .then(res => {
      if (res.data.length > 0) {
        _self.fields.dialogVisible = true;
        _self.fields.dialogTitle = '步骤里的字段和其来源';
        _self.$nextTick(() => {
          _self.$refs['showFields'].listFields(res.data);
          _self.$refs['showFields'].showStepName(stepName);
        });
      } else {
        _self.$message({
          message: '无法找到任何字段',
          type: 'warning'
        });
      }
    })
    .catch(error => {
      const errorResultData = error.response.data;
      _self.$message({
        message: errorResultData.error.message,
        type: 'warning'
      });
    });
}
// 查看输出字段
export function showOutputFields () {
  const enc = new mxCodec(mxUtils.createXmlDocument());
  const node = enc.encode(graph.getModel());
  const value = mxUtils.getPrettyXml(node);
  const stepName = currentCell.getAttribute('name');
  const params = {
    'stepName': stepName
  };
  API.trans.outPutFields(value, params)
    .then(res => {
      if (res.data.length > 0) {
        _self.fields.dialogVisible = true;
        _self.fields.dialogTitle = '步骤里的字段和其来源';
        _self.$nextTick(() => {
          _self.$refs['showFields'].listFields(res.data);
          _self.$refs['showFields'].showStepName(stepName);
        });
      } else {
        _self.$message({
          message: '无法找到任何字段',
          type: 'warning'
        });
      }
    })
    .catch(error => {
      const errorResultData = error.response.data;
      _self.$message({
        message: errorResultData.error.message,
        type: 'warning'
      });
    });
}
// 编辑组件描述信息
export function editPluginDiscription () {
  const discription = currentCell.getAttribute(global.ELEMENT_DEFAULT_ATTRIBUTE_DESCRIPTION);
  _self.discription.dialogTitle = '编辑描述信息';
  _self.discription.value = discription;
  _self.discription.dialogVisible = true;
  _self.currentCell = currentCell;
}
// 连线上右键=======================================================
// 删除节点连接
export function deleteEdge () {
  graph.cellsRemoved([currentCell]);
}
/**
 * 使节点失效
 */
export function lineInvalidHandler () {
  currentCell.setAttribute(global.EDGE_ELEMENT_ATTRIBUTE_ENABLED, global.EDGE_ELEMENT_ATTRIBUTE_ENABLED_FALSE_VALUE);
  studio.setEdge(graph, _self.currentModel, currentCell, global.EDGE_ELEMENT_ATTRIBUTE_ENABLED_FALSE_VALUE);
  // 标记当前流程已修改
  _self.setUpdateFlag(true);
}
/**
 * 使节点生效
 */
export function lineValidHandler () {
  currentCell.setAttribute(global.EDGE_ELEMENT_ATTRIBUTE_ENABLED, global.EDGE_ELEMENT_ATTRIBUTE_ENABLED_TRUE_VALUE);
  studio.setEdge(graph, _self.currentModel, currentCell, global.EDGE_ELEMENT_ATTRIBUTE_ENABLED_TRUE_VALUE);
  // 标记当前流程已修改
  _self.setUpdateFlag(true);
}
// 画布上右键=======================================================
// 查看图形文件
export function previewXML () {
  // 获取mxGraph xml
  const xml = studio.getMxGraphXml(graph);
  // 显示
  _self.preview.dialogVisible = true;
  _self.preview.dialogTitle = '查看图形文件';
  _self.preview.xml = xml;
}
// 查看转换引擎文件
export function previewTransKettleXML () {
  // 获取mxGraph xml
  const xml = studio.getMxGraphXml(graph);
  // 获取kettle xml
  API.trans.ktr(xml)
    .then(res => {
      if (res.data) {
        _self.preview.dialogVisible = true;
        _self.preview.dialogTitle = '查看引擎文件';
        _self.preview.xml = res.data;
      }
    })
    .catch(error => {
      const errorResultData = error.response.data;
      this.$message({
        message: errorResultData.error.message,
        type: 'warning'
      });
    });
}
// 全选
export function selectAll () {
  graph.selectAll();
}
// 清除选择
export function clearSelect () {
  graph.clearSelection();
}
// 打开新建注释弹框
export function createNotepad () {
  _self.notepad.value = '';
  _self.notepad.dialogVisible = true;
  _self.notepad.dialogTitle = '注释';
}
// 创建新建注释组件
export function createNotepadHandler (currCell) {
  var parent = graph.getDefaultParent();
  let cell = null;
  const text = _self.$refs['notepad'].value;
  if (currCell === null) {
    // 创建
    const noteEle = userDefinedNoteElement(_self.notepad.value);
    graph.getModel().beginUpdate();
    try {
      // const style = 'note;shape=mxgraph.basic.document;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#000000;strokeWidth=2';
      cell = graph.insertVertex(parent, null, noteEle, _self.mouse.pageX, _self.mouse.pageY, 40, 40, 'note');
      setNotepadGeometryByText(text, cell);
    } finally {
      // Updates the display
      graph.getModel().endUpdate();
    }
  } else {
    // 编辑
    cell = currCell;
    cell.setAttribute(global.ELEMENT_DEFAULT_ATTRIBUTE_NOTE, text);
    // 根据内容设置注解组件的宽高
    setNotepadGeometryByText(text, cell);
    graph.refresh(cell);
  }
  _self.notepad.dialogVisible = false;
}
// 创建自定义注解标签
function userDefinedNoteElement (noteValue) {
  var doc = mxUtils.createXmlDocument();
  var element = doc.createElement(global.NOTE_ELEMENT);
  // 默认属性
  element.setAttribute(global.ELEMENT_DEFAULT_ATTRIBUTE_NOTE, noteValue);
  return element;
}
// 根据内容设置注解组件的宽高
export function setNotepadGeometryByText (text, cell) {
  const textArr = text.split('\n');
  const heightLength = textArr.length;
  const geometry = graph.model.getGeometry(cell);
  // 获取最长字符
  const maxLength = getMaxLengthCharacter(textArr);
  if (geometry.width < maxLength * global.CHARACTER_WIDTH) {
    geometry.width = maxLength * global.CHARACTER_WIDTH;
  }
  if (geometry.height < heightLength * global.CHARACTER_HEIGHT) {
    geometry.height = heightLength * global.CHARACTER_HEIGHT;
  }
}
// 获取最长字符的长度
function getMaxLengthCharacter (arr) {
  let maxLength = arr[0].length;
  if (arr.length > 0) {
    for (let i = 0; i < arr.length - 1; i++) {
      maxLength = maxLength < (arr[i + 1]).length ? (arr[i + 1]).length : maxLength;
    }
  }
  return maxLength;
}
// 转换组件上右键==========================================================
// 复制模式发送
export function copyDeliverModel () {
  const selectionCell = graph.getSelectionCell();
  // 改变属性值
  selectionCell.setAttribute('distribute', 'N');
  const childrenCells = selectionCell.children;
  if (childrenCells.length > 0) {
    for (let i = 0; i < childrenCells.length; i++) {
      const childrenCell = childrenCells[i];
      if (childrenCell.edges) {
        const edges = childrenCell.edges;
        for (let j = 0; j < edges.length; j++) {
          const edge = edges[j];
          let overlays = graph.getCellOverlays(edge);
          overlays = new mxCellOverlay(
            new mxImage(global.EDGE_ELEMENT_IMAGE_PATH, 16, 16), '');
          // 鼠标样式
          overlays.cursor = 'move';
          graph.addCellOverlay(edge, overlays);
        }
      }
    }
  }
  // 标记当前流程已修改
  _self.setUpdateFlag(true);
};
// 轮流发送模式
export function turnDeliverModel () {
  const selectionCell = graph.getSelectionCell();
  // 改变属性值
  selectionCell.setAttribute('distribute', 'Y');
  const childrenCells = selectionCell.children;
  if (childrenCells.length > 0) {
    for (let i = 0; i < childrenCells.length; i++) {
      const childrenCell = childrenCells[i];
      if (childrenCell.edges) {
        const edges = childrenCell.edges;
        for (let j = 0; j < edges.length; j++) {
          const edge = edges[j];
          graph.removeCellOverlays(edge);
        }
      }
    }
  }
  // 标记当前流程已修改
  _self.setUpdateFlag(true);
};
// 作业组件上右键==========================================================
// 右键打开一个转换或作业流程
export async function oepnFlow () {
  _self.tab.loading = true;
  const selectionCell = graph.getSelectionCell();
  const jsonObj = studio.pluginValueToObject(selectionCell);
  const pluginType = selectionCell.getAttribute('type');
  let type = null;
  let path = jsonObj['directory'];
  let xml = null;
  // 获取xml
  if (pluginType === 'TRANS') {
    type = global.TRANS_MODEL;
    const name = jsonObj['transname'];
    path += '/' + name;
    xml = await studio.getTransXml(path, name);
  } else {
    type = global.JOB_MODEL;
    const name = jsonObj['jobname'];
    path += '/' + name;
    xml = await studio.getJobXml(path, name);
  }
  // 根据xml打开流程
  _self.openRepository(xml.data, type, path);
  _self.tab.loading = false;
}
// 作业组件连线上右键=======================================================
// 评价条件 无条件
export function rateNoCondition () {
  const edge = currentCell;
  // 去掉线上原有图标
  graph.removeCellOverlays(edge);
  // 获取连线是否有效的属性
  const edgeEnable = edge.getAttribute('enabled');
  if (edgeEnable === global.EDGE_ELEMENT_ATTRIBUTE_ENABLED_TRUE_VALUE) { // enabled=Y
    // 改变线的颜色
    // graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, global.EDGE_ELEMENT_STYLE_DEFAULT_STROKECOLOR);
    edge.style = 'hop;';
  }
  // 改变评价条件属性 unconditional=Y
  edge.setAttribute(global.EDGE_ELEMENT_ATTRIBUTE_UNCONDITION, global.EDGE_ELEMENT_ATTRIBUTE_UNCONDITION_TRUE_VALUE);
  // 改变线上图标
  const image = new mxImage(global.PLUGIN_STATE_IMAGE_UNCONDITION, 16, 16);
  let overlays = graph.getCellOverlays(edge);
  overlays = new mxCellOverlay(image, '');
  // 鼠标样式
  overlays.cursor = 'move';
  graph.addCellOverlay(edge, overlays);
  graph.refresh(edge);
}
// 评价条件 条件为真时继续下一步
export function rateTrueCondition () {
  const edge = currentCell;
  // 去掉线上原有图标
  graph.removeCellOverlays(edge);
  // 获取连线是否有效的属性
  const edgeEnable = edge.getAttribute('enabled');
  if (edgeEnable === global.EDGE_ELEMENT_ATTRIBUTE_ENABLED_TRUE_VALUE) { // enabled=Y
    // 改变线的颜色
    // graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, global.JOB_EDGE_TRUE_STROKECOLOR);
    edge.style = 'hop;evaluation-true';
  }
  // 改变评价条件属性  unconditional=N  evaluatio=Y
  edge.setAttribute(global.EDGE_ELEMENT_ATTRIBUTE_UNCONDITION, global.EDGE_ELEMENT_ATTRIBUTE_UNCONDITION_FALSE_VALUE);
  edge.setAttribute(global.EDGE_ELEMENT_ATTRIBUTE_EVALUATION, global.EDGE_ELEMENT_ATTRIBUTE_EVALUATION_TRUE_VALUE);
  // 改变线上图标
  const image = new mxImage(global.PLUGIN_STATE_IMAGE_TRUE, 16, 16);
  let overlays = graph.getCellOverlays(edge);
  overlays = new mxCellOverlay(image, '');
  // 鼠标样式
  overlays.cursor = 'move';
  graph.addCellOverlay(edge, overlays);
  graph.refresh(edge);
}
// 评价条件 条件为假时继续下一步
export function rateFalseCondition () {
  const edge = currentCell;
  // 去掉线上原有图标
  graph.removeCellOverlays(edge);
  // 获取连线是否有效的属性
  const edgeEnable = edge.getAttribute('enabled');
  if (edgeEnable === global.EDGE_ELEMENT_ATTRIBUTE_ENABLED_TRUE_VALUE) { // enabled=Y
    // 改变线的颜色
    // graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, global.JOB_EDGE_FALSE_STROKECOLOR);
    edge.style = 'hop;evaluation-false';
  }
  // 改变评价条件属性 unconditional=N  evaluatio=N
  edge.setAttribute(global.EDGE_ELEMENT_ATTRIBUTE_UNCONDITION, global.EDGE_ELEMENT_ATTRIBUTE_UNCONDITION_FALSE_VALUE);
  edge.setAttribute(global.EDGE_ELEMENT_ATTRIBUTE_EVALUATION, global.EDGE_ELEMENT_ATTRIBUTE_EVALUATION_FALSE_VALUE);
  // 改变线上图标
  const image = new mxImage(global.PLUGIN_STATE_IMAGE_FALSE, 16, 16);
  let overlays = graph.getCellOverlays(edge);
  overlays = new mxCellOverlay(image, '');
  // 鼠标样式
  overlays.cursor = 'move';
  graph.addCellOverlay(edge, overlays);
  graph.refresh(edge);
}
// 查看作业引擎文件
export function previewJobKettleXML () {
  // 获取mxGraph xml
  const xml = studio.getMxGraphXml(graph);
  // 获取kettle xml
  API.job.kjb(xml)
    .then(res => {
      if (res.data) {
        _self.preview.dialogVisible = true;
        _self.preview.dialogTitle = '查看引擎文件';
        _self.preview.xml = res.data;
      }
    })
    .catch(error => {
      const errorResultData = error.response.data;
      this.$message({
        message: errorResultData.error.message,
        type: 'warning'
      });
    });
}
// 注释上右键=======================================================
// 编辑注释
export function editNotepad () {
  const cell = graph.getSelectionCell();
  _self.editNotePluginByDoubleClick(cell);
}
// 删除注释
export function deleteNotepad () {
  const cells = graph.getSelectionCells();
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    if (cell.value.tagName === global.NOTE_ELEMENT) {
      // 删除组件
      graph.removeCells([cell], true);
    }
  }
}
