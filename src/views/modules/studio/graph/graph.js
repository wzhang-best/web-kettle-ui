/* eslint semi: ["error", "always"] */
/* eslint-disable new-cap */
/* eslint-disable no-new */
/**
 * 初始化mxGraph
 */
import mxgraph from '@/views/modules/studio/graph/index.js';
// 定义右键事件
import popupMenu from '@/views/modules/studio/common/context-menu.json';
// 右键事件方法
import * as popupMenuHandler from '@/views/modules/studio/js/popup-menu-handler.js';
// 设置mxGraph样式
import * as style from '@/views/modules/studio/graph/graph-style.js';
// 全局常量
import * as global from '@/views/modules/studio/common/common.js';
// 公共方法
import * as studio from '@/views/modules/studio/js/studio-handler.js';
const {
  // mxGraph,
  // mxOutline,
  mxEvent,
  // mxCell,
  // mxGeometry,
  mxUtils,
  // mxEventObject,
  // mxConnectionHandler,
  mxClient,
  mxConstants,
  mxGraphHandler,
  mxGuide,
  mxEdgeHandler,
  mxEditor,
  mxDivResizer,
  // mxEdgeStyle,
  // mxPerimeter,
  // mxDragSource,
  // mxPoint,
  mxImage,
  // mxFastOrganicLayout,
  mxCodec,
  // mxObjectCodec,
  mxCellOverlay
  // mxResources
  // mxVertexHandler,
  // mxCellState,
  // mxPerimeter
  // mxCellEditor,
  // mxShape,
  // mxXmlCanvas2D,
  // mxCodecRegistry
} = mxgraph;
let editor = null;
let graph = null;
let _self = null;
/**
 * 初始化
 * @param {Object} type 当前模式 转换/作业
 * @param {Object} container 画布div
 */
export function init (self, type, container) {
  editor = new mxEditor();
  graph = editor.graph;
  _self = self;
  // editor.setGraphContainer(container);
  setDefaultConfig(editor, container);
  setOverwriteFunc(type, graph);
  setVertexStyle();
};
// 默认配置
function setDefaultConfig (editor, container) {
  // Checks if the browser is supported
  if (!mxClient.isBrowserSupported()) {
    // Displays an error message if the browser is not supported.
    console.error('Browser is not supported!');
  } else {
    console.log('supported.');
  }
  // Assigns some global constants for general behaviour, eg. minimum
  // size (in pixels) of the active region for triggering creation of
  // new connections, the portion (100%) of the cell area to be used
  // for triggering new connections, as well as some fading options for
  // windows and the rubberband selection.
  mxConstants.MIN_HOTSPOT_SIZE = 16;
  mxConstants.DEFAULT_HOTSPOT = 1;
  // Enables guides
  mxGraphHandler.prototype.guidesEnabled = true;
  // Alt disables guides
  mxGuide.prototype.isEnabledForEvent = function (evt) {
    return !mxEvent.isAltDown(evt);
  };
  // Enables snapping waypoints to terminals
  mxEdgeHandler.prototype.snapToTerminals = true;

  // Workaround for Internet Explorer ignoring certain CSS directives
  if (mxClient.IS_QUIRKS) {
    document.body.style.overflow = 'hidden';
    new mxDivResizer(container);
  }
  editor.setGraphContainer(container);
  // Disable highlight of cells when dragging from toolbar
  graph.setDropEnabled(false);
  // Enables new connections
  graph.setConnectable(true);
  // Uses the port icon while connections are previewed
  graph.connectionHandler.getConnectImage = function (state) {
    return new mxImage(state.style[mxConstants.STYLE_IMAGE], 16, 16);
  };
  // 隐藏折叠/展开功能
  graph.foldingEnabled = false;
  // Centers the port icon on the target port
  graph.connectionHandler.targetConnectImage = true;

  // Does not allow dangling edges
  graph.setAllowDanglingEdges(false);
  // Do not allow removing labels from parents
  graph.graphHandler.removeCellsFromParent = false;
  // Autosize labels on insert where autosize=1
  graph.autoSizeCellsOnAdd = true;
  // 相同两个锚点只允许一条连线
  graph.setMultigraph(false);
  // 允许连线的目标和源是同一元素
  graph.setAllowLoops(false);
  // Defines the default group to be used for grouping. The
  // default group is a field in the mxEditor instance that
  // is supposed to be a cell which is cloned for new cells.
  // The groupBorderSize is used to define the spacing between
  // the children of a group and the group bounds.
  // 键盘事件
  // var config = mxUtils.load('/static/studio/config/keyhandler-commons.xml').getDocumentElement();
  // editor.configure(config);

  // Disables drag-and-drop into non-swimlanes.
  graph.isValidDropTarget = function (cell, cells, evt) {
    return this.isSwimlane(cell);
  };
  // Does not allow selection of locked cells
  graph.isCellSelectable = function (cell) {
    return !this.isCellLocked(cell);
  };
  // Disables drilling into non-swimlanes.
  graph.isValidRoot = function (cell) {
    return this.isValidDropTarget(cell);
  };
};
// 设置样式
function setVertexStyle () {
  // 设置mxGraph样式
  style.configureStylesheet(graph);
  // 设置组件图片样式
  style.configurePluginImageStyle(graph);
};
// 重写mxGraph中的方法
function setOverwriteFunc (type, graph) {
  // 重写 判断锚点是否是源点
  graph.isValidSource = function (cell) {
    if (cell.value === global.PLUGIN_OUTPUT_TOOLTIP) {
      return true;
    }
  };
  // 重写 判断锚点是否是目标点
  graph.isValidTarget = function (cell) {
    if (cell.value === global.PLUGIN_INPUT_TOOLTIP) {
      return true;
    }
  };
  graph.isHtmlLabel = function (cell) {
    return !this.isSwimlane(cell);
  };
  // 控制组件大小不可变
  graph.isCellResizable = function (cell) {
    return false;
  };
  const connectionHandler = graph.connectionHandler;
  // 重写连线方法
  connectionHandler.insertEdge = function (parent, id, value, source, target, style) {
    var doc = mxUtils.createXmlDocument();
    var edgeObj = doc.createElement(global.EDGE_ELEMENT);
    let edge = null;
    // 默认连线有效 enable=Y
    edgeObj.setAttribute(global.EDGE_ELEMENT_ATTRIBUTE_ENABLED, global.EDGE_ELEMENT_ATTRIBUTE_ENABLED_TRUE_VALUE);
    // 当前模式为转换模式
    if (type === global.TRANS_MODEL) {
      // 设置数据发送菜单图片设置
      // transInsertEdge(edge);
      style = `hop`;
      edge = graph.insertEdge(parent, id, edgeObj, source, target, style);
      const parentCell = edge.source.parent;
      const distributeValue = parentCell.getAttribute('distribute');
      if (distributeValue === 'N') {
        let overlays = graph.getCellOverlays(edge);
        overlays = new mxCellOverlay(
          new mxImage(global.EDGE_ELEMENT_IMAGE_PATH, 16, 16), '');
        // 鼠标样式
        overlays.cursor = 'move';
        graph.addCellOverlay(edge, overlays);
      }
    } else {
      // 作业模式的连线方式
      // edge = await jobInsertEdge(parent, id, edgeObj, source, target, style, edge);
      let image = null;
      // 当前模式为作业模式
      const sourceParent = source.parent;
      const sourceType = sourceParent.getAttribute('type');
      // 类型为SPECIAL 默认为(无条件) 线上图标为锁
      if (sourceType === 'SPECIAL') {
        // 评价条件 enabled=Y unconditional=Y evaluatio=Y
        edgeObj.setAttribute(global.EDGE_ELEMENT_ATTRIBUTE_UNCONDITION, global.EDGE_ELEMENT_ATTRIBUTE_UNCONDITION_TRUE_VALUE);
        edgeObj.setAttribute(global.EDGE_ELEMENT_ATTRIBUTE_EVALUATION, global.EDGE_ELEMENT_ATTRIBUTE_EVALUATION_TRUE_VALUE);
        image = new mxImage(global.PLUGIN_STATE_IMAGE_UNCONDITION, 16, 16);
        style = `hop`;
      } else {
        // 评价条件 enabled=Y unconditional=N  evaluatio=Y
        edgeObj.setAttribute(global.EDGE_ELEMENT_ATTRIBUTE_UNCONDITION, global.EDGE_ELEMENT_ATTRIBUTE_UNCONDITION_FALSE_VALUE);
        edgeObj.setAttribute(global.EDGE_ELEMENT_ATTRIBUTE_EVALUATION, global.EDGE_ELEMENT_ATTRIBUTE_EVALUATION_TRUE_VALUE);
        // 评价条件为(为真时继续下一步) 线的颜色为绿色 图标为对勾
        image = new mxImage(global.PLUGIN_STATE_IMAGE_TRUE, 16, 16);
        style = `hop;evaluation-true`;
      }
      edge = graph.insertEdge(parent, id, edgeObj, source, target, style);
      let overlays = graph.getCellOverlays(edge);
      overlays = new mxCellOverlay(image, '');
      // 鼠标样式
      overlays.cursor = 'move';
      graph.addCellOverlay(edge, overlays);
    }
    return edge;
  };
  // 重写读取组件label方法
  graph.getLabel = function (cell) {
    if (cell.value.nodeName === global.TRANS_ELEMENT || cell.value.nodeName === global.JOB_ELEMENT) {
      return cell.getAttribute(global.ELEMENT_DEFAULT_ATTRIBUTE_NAME);
    } else if (cell.value.nodeName === global.NOTE_ELEMENT) {
      const text = cell.getAttribute(global.ELEMENT_DEFAULT_ATTRIBUTE_NOTE);
      // 根据内容设置组件的宽高
      // popupMenuHandler.setNotepadGeometryByText(text, cell);
      return text;
    } else {
      return '';
    }
    // return this.convertValueToString(cell);
  };
  // Shows a "modal" window when double clicking a vertex.
  // 重写组件双击方法
  graph.dblClick = function (evt, cell) {
    // Do not fire a DOUBLE_CLICK event here as mxEditor will
    // consume the event and start the in-place editor.
    if (this.isEnabled() && !mxEvent.isConsumed(evt) && cell != null && this.isCellEditable(cell)) {
      if (this.model.isEdge(cell) || !this.isHtmlLabel(cell)) {
        this.startEditingAtCell(cell);
      } else {
        // var data = cell.data.split(',');
        // _self.editPluginByDoubleClick(data[0], data[1]);
        _self.editPluginByDoubleClick(cell);
        // var content = document.createElement('div');
        // content.innerHTML = this.convertValueToString(cell);
        // alert(content.innerHTML);
      }
    }
    // Disables any default behaviour for the double click
    mxEvent.consume(evt);
  };
  // 重写组件单机方法(单击连线改变颜色)
  graph.click = function (me) {
    const event = me.getEvent();
    if (me.state || me.consumed) {
      const cell = me.getCell();
      // 点击鼠标左键
      if (cell && cell.edge && mxEvent.isLeftMouseButton(event)) {
        const enableValue = cell.getAttribute(global.EDGE_ELEMENT_ATTRIBUTE_ENABLED);
        if (enableValue === global.EDGE_ELEMENT_ATTRIBUTE_ENABLED_TRUE_VALUE) { // enabled=Y
          // 改变连线的有效属性
          cell.setAttribute(global.EDGE_ELEMENT_ATTRIBUTE_ENABLED, global.EDGE_ELEMENT_ATTRIBUTE_ENABLED_FALSE_VALUE);
          studio.setEdge(graph, type, cell, global.EDGE_ELEMENT_ATTRIBUTE_ENABLED_FALSE_VALUE);
        } else { // enabled=N
          cell.setAttribute(global.EDGE_ELEMENT_ATTRIBUTE_ENABLED, global.EDGE_ELEMENT_ATTRIBUTE_ENABLED_TRUE_VALUE);
          studio.setEdge(graph, type, cell, global.EDGE_ELEMENT_ATTRIBUTE_ENABLED_TRUE_VALUE);
        }
        // 标记当前流程已做修改
        _self.setUpdateFlag(true);
        // 点击鼠标右键
      } else if (mxEvent.isRightMouseButton(event)) {
        // 保存鼠标位置
        _self.mouse.pageX = event.offsetX;
        _self.mouse.pageY = event.offsetY;
      }
    } else {
      graph.clearSelection();
    }
  };
  // 重写组件提示信息
  graph.getTooltipForCell = function (cell) {
    if (cell.children) { // 组件上提示
      return cell.getAttribute(global.ELEMENT_DEFAULT_ATTRIBUTE_NAME);
    } else {
      return cell.value; // 锚点上提示
    }
  };
  // Installs context menu创建右键菜单
  graph.popupMenuHandler.factoryMethod = function (menu, cell, evt) {
    // 锚点上点击右键无效
    if (cell !== null && (cell.value === 'Input' || cell.value === 'Output')) {
      return null;
    } else if (cell !== null && cell.value.tagName === global.NOTE_ELEMENT) { // 注释右键菜单
      return createNotepadPopupMenu(graph, menu, cell, evt);
    } else {
      return createPopupMenu(type, graph, menu, cell, evt);
    }
  };
  // xml 设置默认的defaultParent标签(info)
  const defaultParentElement = userDefinedDefaultParentElement(type);
  graph.getDefaultParent().value = defaultParentElement;
  // 连线校验
  graph.getEdgeValidationError = function (edge, source, target) {
    if (edge != null && !this.isAllowDanglingEdges() && (source == null || target == null)) {
      return '';
    }
    if (edge != null && this.model.getTerminal(edge, true) == null &&
      this.model.getTerminal(edge, false) == null) {
      return null;
    }

    // Checks if we're dealing with a loop
    if (!this.allowLoops && source === target && source !== null) {
      return '';
    }

    // Checks if the connection is generally allowed
    if (!this.isValidConnection(source, target)) {
      return '';
    }

    if (source != null && target != null) {
      var error = '';
      // Checks if the cells are already connected
      // and adds an error message if required
      // 禁止源点和目标点在同一组件上
      if (source.getParent() === target.getParent()) {
        return '';
      }
      if (!this.multigraph) {
        var tmp = this.model.getEdgesBetween(source, target, true);
        // Checks if the source and target are not connected by another edge
        if (tmp.length > 1 || (tmp.length === 1 && tmp[0] !== edge)) {
          // error += (mxResources.get(this.alreadyConnectedResource) ||
          //   this.alreadyConnectedResource) + '\n';
          // _self.$message({
          //   message: '不可重复连线',
          //   type: 'warning'
          // });
          return '';
        }
      }

      // Gets the number of outgoing edges from the source
      // and the number of incoming edges from the target
      // without counting the edge being currently changed.
      var sourceOut = this.model.getDirectedEdgeCount(source, true, edge);
      var targetIn = this.model.getDirectedEdgeCount(target, false, edge);

      // Checks the change against each multiplicity rule
      if (this.multiplicities != null) {
        for (var i = 0; i < this.multiplicities.length; i++) {
          var err = this.multiplicities[i].check(this, edge, source,
            target, sourceOut, targetIn);

          if (err != null) {
            error += err;
          }
        }
      }

      // Validates the source and target terminals independently
      var err1 = this.validateEdge(edge, source, target);
      if (err1 != null) {
        error += err1;
      }

      return (error.length > 0) ? error : null;
    }

    return (this.allowDanglingEdges) ? null : '';
  };
  graph.model.addListener(mxEvent.CHANGE, function (sender, evt) {
    var changes = evt.getProperty('edit').changes;
    var nodes = [];
    var codec = new mxCodec();
    for (var i = 0; i < changes.length; i++) {
      nodes.push(codec.encode(changes[i]));
    }
    if (nodes[0].tagName === 'mxChildChange') { // 增加或删除了组件
      _self.setUpdateFlag(true); // 标记当前画布上的流程已做修改
    }
    if (nodes[0].tagName === 'mxGeometryChange') { // 移动位置
      _self.setUpdateFlag(true); // 标记当前画布上的流程已做修改
    }
  });
};
// 转换连线 设置数据发送菜单图片设置 distribute=N 有图 反之无图
// function transInsertEdge (edge) {
//   const parentCell = edge.source.parent;
//   const distributeValue = parentCell.getAttribute('distribute');
//   if (distributeValue === 'N') {
//     let overlays = graph.getCellOverlays(edge);
//     overlays = new mxCellOverlay(
//       new mxImage(global.EDGE_ELEMENT_IMAGE_PATH, 16, 16), '');
//     // 鼠标样式
//     overlays.cursor = 'move';
//     graph.addCellOverlay(edge, overlays);
//   }
// }
// 作业连线
// function jobInsertEdge (parent, id, edgeObj, source, target, style, edge) {
//   let image = null;
//   // 当前模式为作业模式
//   const sourceParent = source.parent;
//   const sourceType = sourceParent.getAttribute('type');
//   // 类型为SPECIAL 默认为(无条件) 线上图标为锁
//   if (sourceType === 'SPECIAL') {
//     // 评价条件 enabled=Y unconditional=Y evaluatio=Y
//     edgeObj.setAttribute(global.EDGE_ELEMENT_ATTRIBUTE_UNCONDITION, global.EDGE_ELEMENT_ATTRIBUTE_UNCONDITION_TRUE_VALUE);
//     edgeObj.setAttribute(global.EDGE_ELEMENT_ATTRIBUTE_EVALUATION, global.EDGE_ELEMENT_ATTRIBUTE_EVALUATION_TRUE_VALUE);
//     image = new mxImage(global.PLUGIN_STATE_IMAGE_UNCONDITION, 16, 16);
//     style = `hop`;
//   } else {
//     // 评价条件 enabled=Y unconditional=N  evaluatio=Y
//     edgeObj.setAttribute(global.EDGE_ELEMENT_ATTRIBUTE_UNCONDITION, global.EDGE_ELEMENT_ATTRIBUTE_UNCONDITION_FALSE_VALUE);
//     edgeObj.setAttribute(global.EDGE_ELEMENT_ATTRIBUTE_EVALUATION, global.EDGE_ELEMENT_ATTRIBUTE_EVALUATION_TRUE_VALUE);
//     // 评价条件为(为真时继续下一步) 线的颜色为绿色 图标为对勾
//     image = new mxImage(global.PLUGIN_STATE_IMAGE_TRUE, 16, 16);
//     style = `hop;evaluation-true`;
//   }
//   edge = graph.insertEdge(parent, id, edgeObj, source, target, style);
//   let overlays = graph.getCellOverlays(edge);
//   overlays = new mxCellOverlay(image, '');
//   // 鼠标样式
//   overlays.cursor = 'move';
//   graph.addCellOverlay(edge, overlays);
//   return edge;
// };
// 创建注释右键菜单
function createNotepadPopupMenu (graph, menu, cell, evt) {
  // 保存当前点击的组件
  popupMenuHandler.setCurrentCell(cell);
  const notepadPopupMenuList = popupMenu.notepad;
  createPopupMenuHandler(menu, notepadPopupMenuList, null, null);
};
// 创建右键菜单
function createPopupMenu (type, graph, menu, cell, evt) {
  // 保存当前点击的组件
  popupMenuHandler.setCurrentCell(cell);
  if (type === global.TRANS_MODEL) {
    // 创建转换右键菜单
    createTransPopupMenu(cell, menu);
  } else {
    // 转换作业右键菜单
    createJobPopupMenu(cell, menu);
  }
};
// 创建转换右键菜单
function createTransPopupMenu (cell, menu) {
  const pluginPopupMenuList = popupMenu.trans.pluginMenu;
  const linePopupMenuList = popupMenu.trans.lineMenu;
  const canvasPopupMenuList = popupMenu.trans.canvasMenu;
  if (cell != null && !cell.edge) {
    // 组件上右键菜单
    createPopupMenuHandler(menu, transPluginPopupMenuDataHandler(cell, pluginPopupMenuList), null, null);
  } else if (cell != null && cell.edge) {
    // 连线上右键菜单
    createPopupMenuHandler(menu, transLinePopupMenuDataHandler(cell, linePopupMenuList), null, null);
  } else {
    // 画布上右键菜单
    createPopupMenuHandler(menu, canvasPopupMenuList, null, null);
  }
}
// 创建作业右键菜单
function createJobPopupMenu (cell, menu) {
  const pluginPopupMenuList = popupMenu.job.pluginMenu;
  const linePopupMenuList = popupMenu.job.lineMenu;
  const canvasPopupMenuList = popupMenu.job.canvasMenu;
  if (cell != null && !cell.edge) {
    // 组件上右键菜单
    createPopupMenuHandler(menu, jobPluginMenuDataHandler(cell, pluginPopupMenuList), null, null);
  } else if (cell != null && cell.edge) {
    // 连线上右键菜单
    createPopupMenuHandler(menu, jobLinePopupMenuDataHandler(cell, linePopupMenuList), null, null);
  } else {
    // 画布上右键菜单
    createPopupMenuHandler(menu, canvasPopupMenuList, null, null);
  }
};
/**
 * 处理连线右键菜单数据
 * @param {Object} cell
 * @param {Object} linePopupMenuList
 */
function transLinePopupMenuDataHandler (cell, linePopupMenuList) {
  return lineValidDataHandler(cell, linePopupMenuList);
}
// 处理作业连线上右键菜单数据
function jobLinePopupMenuDataHandler (cell, linePopupMenuList) {
  for (let i = 0; i < linePopupMenuList.length; i++) {
    const menu = linePopupMenuList[i];
    if (menu.children) {
      let childrenMenu = menu.children;
      // 设置评价模式事件图标
      childrenMenu = lineEvaluateDataHandler(cell, childrenMenu);
    }
  }
  // 连线有效失效数据处理
  return lineValidDataHandler(cell, linePopupMenuList);
};
// 处理作业组件上右键菜单数据
function jobPluginMenuDataHandler (cell, pluginPopupMenuList) {
  // 将字符串转成对象
  const jsonObj = studio.pluginValueToObject(cell);
  for (let i = 0; i < pluginPopupMenuList.length; i++) {
    const menu = pluginPopupMenuList[i];
    if (menu.method === 'oepnFlow') {
      if (jsonObj) {
        const directory = jsonObj['directory'];
        if (directory) { // 当组件上directory不为空时 显示open方法
          menu.display = true;
        } else {
          menu.display = false;
        }
      } else {
        menu.display = false;
      }
    }
  }
  return pluginPopupMenuList;
}
/**
 * 设置评价模式事件图标
 * @param {Object} cell 当前选中的组件
 * @param {Object} childrenMenu 右键菜单数据
 */
function lineEvaluateDataHandler (cell, childrenMenu) {
  const type = cell.source.parent.getAttribute('type');
  const unconditional = cell.getAttribute('unconditional');
  const evaluation = cell.getAttribute('evaluation');
  for (let j = 0; j < childrenMenu.length; j++) {
    childrenMenu[j].enabled = true; // 设置按钮可点击
    // 设置评价模式已选择事件图标
    if (unconditional === global.EDGE_ELEMENT_ATTRIBUTE_UNCONDITION_FALSE_VALUE) {
      if (evaluation === global.EDGE_ELEMENT_ATTRIBUTE_EVALUATION_TRUE_VALUE) {
        if (childrenMenu[j].method === 'rateTrueCondition') {
          childrenMenu[j].icon = global.PLUGIN_STATE_IMAGE_TRUE;
        } else {
          childrenMenu[j].icon = null;
        }
      } else {
        if (childrenMenu[j].method === 'rateFalseCondition') {
          childrenMenu[j].icon = global.PLUGIN_STATE_IMAGE_TRUE;
        } else {
          childrenMenu[j].icon = null;
        }
      }
    } else {
      if (childrenMenu[j].method === 'rateNoCondition') {
        childrenMenu[j].icon = global.PLUGIN_STATE_IMAGE_TRUE;
      } else {
        childrenMenu[j].icon = null;
      }
    }
    // 设置评价模式事件可选择属性
    if (type === 'SPECIAL') {
      if (childrenMenu[j].method === 'rateNoCondition') {
        childrenMenu[j].enabled = true;
      } else {
        childrenMenu[j].enabled = false;
      }
    } else if (type.value === 'SUCCESS') {
      if (childrenMenu[j].method === 'rateNoCondition') {
        childrenMenu[j].enabled = false;
      } else {
        childrenMenu[j].enabled = true;
      }
    } else {
      childrenMenu[j].enabled = true;
    }
  }
  return childrenMenu;
}
/**
 * 连线有效无效事件处理 当enabled=Y 隐藏lineValidHandler事件 反之隐藏lineInvalidHandler
 * @param {Object} cell 当前选中的组件
 * @param {Object} childrenMenu 右键菜单数据
 */
function lineValidDataHandler (cell, linePopupMenuList) {
  const enabled = cell.getAttribute(global.EDGE_ELEMENT_ATTRIBUTE_ENABLED);
  for (let j = 0; j < linePopupMenuList.length; j++) {
    linePopupMenuList[j].display = true;
    if (enabled === global.EDGE_ELEMENT_ATTRIBUTE_ENABLED_TRUE_VALUE) {
      if (linePopupMenuList[j].method === 'lineValidHandler') {
        linePopupMenuList[j].display = false;
      }
    } else {
      if (linePopupMenuList[j].method === 'lineInvalidHandler') {
        linePopupMenuList[j].display = false;
      }
    }
  }
  return linePopupMenuList;
}
// 处理转换组件右键菜单数据
function transPluginPopupMenuDataHandler (cell, pluginPopupMenuList) {
  const distributeValue = cell.getAttribute('distribute');
  for (let i = 0; i < pluginPopupMenuList.length; i++) {
    const menu = pluginPopupMenuList[i];
    if (menu.children) {
      const childrenMenu = menu.children;
      for (let j = 0; j < childrenMenu.length; j++) {
        // 设置数据发送的选项
        if (distributeValue === 'Y') {
          if (childrenMenu[j].method === 'turnDeliverModel') {
            childrenMenu[j].icon = global.PLUGIN_STATE_IMAGE_TRUE;
          } else {
            childrenMenu[j].icon = null;
          }
        } else {
          if (childrenMenu[j].method === 'copyDeliverModel') {
            childrenMenu[j].icon = global.PLUGIN_STATE_IMAGE_TRUE;
          } else {
            childrenMenu[j].icon = null;
          }
        }
      }
    }
  }
  return pluginPopupMenuList;
};
// 生成右键菜单
function createPopupMenuHandler (menu, popupMenuList, icon, parent) {
  if (popupMenuList.length > 0) {
    for (let i = 0; i < popupMenuList.length; i++) {
      const popupMenu = popupMenuList[i];
      let method = null;
      if (popupMenu.display) {
        if (popupMenu.method) {
          // method = this.$options.methods[popupMenu.method];
          method = popupMenuHandler[popupMenu.method];
        }
        const parentPopupMenu = menu.addItem(popupMenu.name, popupMenu.icon, method, parent, null, popupMenu.enabled);
        if (popupMenu.separator) { // 添加分割线
          menu.addSeparator();
        }
        if (popupMenu.children) {
          createPopupMenuHandler(menu, popupMenu.children, icon, parentPopupMenu);
        }
      }
    }
  }
  // menu.addItem('Item1', null, function () {
  //   mxUtils.alert('Item1');
  // });
};
// 创建defaultParent标签
function userDefinedDefaultParentElement (type) {
  var doc = mxUtils.createXmlDocument();
  var parentElement = doc.createElement(global.PARENT_ELEMENT);
  parentElement.setAttribute(global.PARENT_ELEMENT_ATTRIBUTE_NAME, '');
  parentElement.setAttribute(global.PARENT_ELEMENT_ATTRIBUTE_TYPE, type);
  parentElement.setAttribute(global.PARENT_ELEMENT_ATTRIBUTE_DIRECTORY, '/');

  return parentElement;
};
export const getGraph = () => graph;
