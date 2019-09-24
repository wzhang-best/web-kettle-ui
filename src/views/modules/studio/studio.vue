<template>
  <div class="studioView" ref="studioView" :style="{ height: pageHeight }">
    <!-- ==============================入口模块========================================== -->
    <el-card class="u-card-enter" v-show="pageShow">
      <el-button type="primary" class="u-button-enter" icon="el-icon-plus" @click="createHandler"></el-button>
      <el-button type="primary" class="u-button-enter" @click="openHandler">打开</el-button>
    </el-card>
    <!-- 创建作业或转换弹框 -->
    <el-dialog
      title="创建"
      :visible.sync="create.dialogVisible"
      width="30%">
      <el-form>
        <el-form-item>
          <el-button type="primary" @click="createTransHandler()" class="u-button-enter2">数据处理流程（转换）</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createJobHandler()"  class="u-button-enter2">业务编排流程（作业）</el-button>
        </el-form-item>
        <el-form-item></el-form-item>
        <el-form-item></el-form-item>
      </el-form>
    </el-dialog>
    <!-- 打开弹框 -->
    <!-- ==============================操作模块========================================== -->
    <el-container class="main" v-show="!pageShow">
      <el-aside width="260px">
        <div class="u-dropdown-div">
          <el-dropdown placement="top-start">
            <span class="el-dropdown-link">
              新建<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="createTransHandler()">数据处理流程（转换）</el-dropdown-item>
              <el-dropdown-item @click.native="createJobHandler()">业务编排流程（作业）</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-tooltip content="打开资源库" placement="bottom" effect="light">
            <el-button class="u-button" @click="openHandler">
              <icon-svg name="open"></icon-svg>
            </el-button>
          </el-tooltip>
          <el-tooltip content="保存" placement="bottom" effect="light">
            <el-button class="u-button" @click="saveClick" :disabled="saveButton.disabled">
              <icon-svg name="save"></icon-svg>
            </el-button>
          </el-tooltip>
          <el-tooltip content="另存为" placement="bottom" effect="light">
            <el-button class="u-button"  @click="saveAsClick" :disabled="saveButton.disabled">
              <icon-svg name="saveas"></icon-svg>
            </el-button>
          </el-tooltip>
        </div>
        <div v-if="leftMenuShow">
          <div class="u-menu-title">
            <span>核心对象</span>
          </div>
          <div>
            <el-scrollbar>
              <el-collapse
                ref="trans"
                accordion
                v-show="pluginMenu.show"
                collapse-transition="true">
                <!-- 转换组件 -->
                <el-collapse-item class=""
                  v-for="(item, index) in pluginMenu.transData"
                  :key="index"
                  :name="index"
                  :title="item.name">
                  <div class="u-plugin-div"
                    v-for="(plugin, index) in item.children"
                    :key="index"
                    :id="plugin.pluginId"
                    :ref="`trans-${plugin.pluginId}`">
                    <img :src="`${global.IMAGE_PATH}${plugin.image}`"/>
                    <span>{{plugin.name}}</span>
                  </div>
                </el-collapse-item>
              </el-collapse>
              <el-collapse
                ref="job"
                v-show="!pluginMenu.show">
                <!-- 作业组件 -->
                <el-collapse-item class=""
                  v-for="(item, index) in pluginMenu.jobData"
                  :key="index"
                  :name="index"
                  :title="item.name">
                  <div class="u-plugin-div"
                    v-for="(plugin, index) in item.children"
                    :key="index"
                    :id="plugin.pluginId"
                    :ref="`job-${plugin.pluginId}`">
                      <img :src="`${global.IMAGE_PATH}${plugin.image}`"/>
                      <span>{{plugin.name}}</span>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-scrollbar>
          </div>
        </div>
      </el-aside>
      <!-- tab页 -->
      <el-main
        v-loading.lock="tab.loading"
        element-loading-text="加载中，请耐心等待">
        <el-tabs
          v-model="tab.activeName"
          type="card"
          @tab-click="clickTab"
          @tab-remove="removeTab">
          <el-tab-pane
            v-for="(item, index) in tab.data"
            :key="item.name"
            :label="item.label"
            :name="item.name"
            :type="item.type"
            :closable="item.closable">
            <!-- {{item.content}} -->
            <span slot="label" v-if="item.type === `${global.TRANS_MODEL}`">
              <img :src="`${global.TRANS_IMAGE_PATH}`"></img> {{item.label}}
            </span>
            <span slot="label" v-else-if="item.type === `${global.JOB_MODEL}`">
              <img :src="`${global.JOB_IMAGE_PATH}`"></img> {{item.label}}
            </span>
            <!-- <el-scrollbar class="u-scrollbar-component" style="height:100%;"> -->
              <keep-alive>
                <component
                  :ref="item.name"
                  v-bind:is="item.content">
                </component>
              </keep-alive>
            <!-- </el-scrollbar> -->
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
    <!-- 资源库弹窗 -->
    <div>
      <el-dialog
        title="资源库"
        :visible.sync="repository.dialogVisible"
        :close-on-click-modal="false"
        v-if="repository.show">
        <u-repository ref="repository" @openRepository="openRepository"></u-repository>
      </el-dialog>
    </div>
    <!-- 组件弹窗 -->
    <div>
      <el-dialog
        :title="plugin.dialogTitle"
        :visible.sync="plugin.dialogVisible"
        width="70%"
        v-if="plugin.show"
        @close="plugin.show = false"
        class="u-el-dialog">
        <transition>
          <keep-alive>
            <plugin-component
              ref="pluginComponent"
              v-bind:is="plugin.component"
              @hook:mounted="setChildData"
              @savePluginData="savePluginData"
              @saveTempPluginData="saveTempPluginData"
              @cancel="plugin.dialogVisible=false">
            </plugin-component>
          </keep-alive> 
        </transition>
      </el-dialog>
    </div>
    <!-- 保存流程时的弹框 -->
    <div>
      <el-dialog
        :title="flow.dialogTitle"
        :visible.sync="flow.dialogVisible"
        :close-on-click-modal="false"
        width="30%">
        <save-flow ref="flow"></save-flow>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveSubmit">保存</el-button>
          <el-button @click="flow.dialogVisible = false">取消</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- ======================画布右键弹框================== -->
    <!-- 右键查看图形文件 引擎文件弹框 -->
    <div>
      <el-dialog
        :title="preview.dialogTitle"
        :visible.sync="preview.dialogVisible"
        :close-on-click-modal="false">
        <el-input
          class="u-textarea"
          type="textarea"
          readonly
          resize = "none"
          v-model="preview.xml"
          :rows="15"
        />
      </el-dialog>
    </div>
    <!-- ======================组件右键弹框================== -->
    <!-- 查看输入输出字段 -->
    <div>
      <el-dialog
        :title="fields.dialogTitle"
        :visible.sync="fields.dialogVisible"
        :close-on-click-modal="false">
        <show-fields ref="showFields"></show-fields>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="fields.dialogVisible=false">确定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 新建注释弹框 -->
    <div>
      <el-dialog
        :title="notepad.dialogTitle"
        :visible.sync="notepad.dialogVisible"
        :close-on-click-modal="false"
        width="40%">
        <el-input
          ref="notepad"
          type="textarea"
          v-model="notepad.value"
          :rows="5"
        />
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="createNotepadHandler">确定</el-button>
          <el-button @click="notepad.dialogVisible=false">取消</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 组件描述信息 -->
    <div>
      <el-dialog
        :title="discription.dialogTitle"
        :visible.sync="discription.dialogVisible"
        :close-on-click-modal="false"
        width="40%">
        <el-input
          ref="notepad"
          type="textarea"
          v-model="discription.value"
          :rows="5"
        />
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editDiscriptionHandler">确定</el-button>
          <el-button @click="discription.dialogVisible=false">取消</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 关闭tab页时的提示信息框 -->
    <div>
      <el-dialog
        class="u-message-dialog"
        title="提示"
        width="25%"
        :visible.sync="messageDialog.visible">
        <div class="el-message-box__content">
          <div class="el-message-box__status el-icon-warning"></div>
          <div class="el-message-box__message">
            <p>文件已发生变化，是否保存?</p>
          </div>
        </div>
        <div class="el-message-box__btns">
          <el-button
            class="el-button el-button--default el-button--small el-button--primary"
            type="button"
            @click="closeTabSaveConfirm(tab.targetName)">是</el-button>
          <el-button
            class="el-button el-button--default el-button--small el-button--danger"
            type="button"
            @click="closeTabSaveCancel(tab.targetName)">否</el-button>
          <el-button
            class="el-button el-button--default el-button--small"
            type="button"
            @click="messageDialog.visible=false">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
/* eslint semi: ["error", "always"] */
/* eslint-disable new-cap */
// import studioJs from '@/views/modules/studio/js/studio.js';
import mxgraph from '@/views/modules/studio/graph/index';
import * as mxInit from '@/views/modules/studio/graph/graph.js';
// 接口api
import API from '@/api';
// 全局常量
import * as global from '@/views/modules/studio/common/common.js';
// 右键事件方法
import * as popupMenuHandler from '@/views/modules/studio/js/popup-menu-handler.js';
// 公共方法
import * as studio from '@/views/modules/studio/js/studio-handler.js';
import transTab from '@/views/modules/studio/tab/trans-tab';
import jobTab from '@/views/modules/studio/tab/job-tab';
// 打开资源库
import repository from '@/views/modules/studio/repository/repository.vue';
// 保存流程
import saveFlow from '@/views/modules/studio/repository/save-flow.vue';
// 右键组件查看输入输出字段
import showfields from '@/views/modules/studio/show-fields/show-fields.vue';
let graph = null;
const {
  // mxGraph,
  // mxOutline,
  mxEvent,
  mxCell,
  mxGeometry,
  mxUtils,
  // mxEventObject,
  // mxConnectionHandler,
  // mxClient,
  // mxConstants,
  // mxGraphHandler,
  // mxGuide,
  // mxEdgeHandler,
  // mxEditor,
  // mxDivResizer,
  // mxEdgeStyle,
  // mxPerimeter,
  mxDragSource,
  mxPoint,
  mxImage,
  mxFastOrganicLayout,
  mxCodec,
  // mxObjectCodec,
  mxCellOverlay
  // mxVertexHandler,
  // mxCellState,
  // mxPerimeter
  // mxCellEditor,
  // mxShape,
  // mxXmlCanvas2D,
  // mxCodecRegistry
} = mxgraph;
export default {
  components: {
    'trans-tab': transTab,
    'job-tab': jobTab,
    'u-repository': repository,
    'save-flow': saveFlow,
    'show-fields': showfields
  },
  data () {
    return {
      create: { // 入口部分创建弹框
        dialogVisible: false
      },
      pageShow: true, // 入口模块，操作模块的显示
      leftMenuShow: true, // 左侧组件菜单及标题显示控制
      saveButton: {
        disabled: true, // 控制保存和另存为按钮的点击
        flag: 'save' // save(保存) saveas(另存为) close(关闭tab页)
      },
      // 组件
      plugin: {
        component: null, // 插件组件
        dialogVisible: false,
        dialogTitle: '',
        show: false,
        transData: [],
        jobData: []
      },
      pluginMenu: { // 左侧菜单
        show: false,
        transData: [],
        jobData: []
      },
      // tab页
      tab: {
        data: [],
        targetName: '', // 记录当前要删除的tab页名称
        activeName: '', // 当前激活的tab页名称
        active: null, // 当前激活的tab页
        refObj: null, // 保存tab页组件对象
        // closable: true, // 标签页是否可关闭
        nameMap: new Map(), // 记录tab页名称，防止重复
        loading: false
      },
      // 预览xml
      preview: {
        dialogTitle: '',
        dialogVisible: false,
        xml: ''
      },
      // 查看输入输出字段
      fields: {
        dialogTitle: '',
        dialogVisible: false
      },
      // 新建注释
      notepad: {
        dialogTitle: '',
        dialogVisible: false,
        value: ''
      },
      // 鼠标当前位置
      mouse: {
        pageX: 0,
        pageY: 0
      },
      // 资源库
      repository: {
        dialogVisible: false,
        show: false
      },
      // 流程
      flow: {
        dialogTitle: '',
        dialogVisible: false
      },
      // 组件描述
      discription: {
        dialogTitle: '',
        dialogVisible: false,
        value: ''
      },
      // 模仿$message弹框
      messageDialog: {
        visible: false
      },
      global: global, // 全局常量
      currentModel: '', // 保存当前模式 作业/转换
      currentCell: null, // 保存当前选中组件
      graphList: [], // 保存graph
      pageHeight: '' // 页面高度，根据父容器高度指定
    };
  },
  methods: {
    // =============================打开资源===================================
    // 打开资源
    openHandler () {
      this.repository.show = false;
      this.$nextTick(() => {
        this.repository.show = true;
      });
      this.repository.dialogVisible = true;
    },
    // 打开一个资源
    async openRepository (xml, type, path) {
      this.currentModel = type;
      let flag = false;
      // 获取所有tab页数据
      const tabList = this.tab.data;
      // 查找当前资源是否已打开
      for (let i = 0; i < tabList.length; i++) {
        const tab = tabList[i];
        if (tab.label === path) { // 当前资源已打开
          this.tab.active = tab;
          this.tab.activeName = tab.name;
          this.tab.targetName = tab.name;
          flag = true;
        }
      }
      // 当前资源未打开
      if (!flag) {
        // 初始化
        await this.createInit(path);
        this.$nextTick(() => {
          // 加载xml
          this.loadTextXml(xml);
          // 记录画布上的组件 防止组件重复
          this.recordPlugin();
          // 在解析后的流程上根据属性补充连线上的图片
          this.drawingByProperties();
        });
      }
      this.repository.dialogVisible = false;
    },
    // 加载xml文件
    loadXml (xml) {
      const layout = new mxFastOrganicLayout(graph, 2);
      graph.getModel().beginUpdate();
      try {
        var doc = mxUtils.load('/static/studio/job.xml');
        var root = doc.getDocumentElement();
        var dec = new mxCodec(root.owerDocument);
        dec.decode(root, graph.getModel());
        var parent = graph.getDefaultParent();
        layout.execute(parent);
      } finally {
        graph.getModel().endUpdate();
      }
    },
    // 加载String xml
    loadTextXml (xml) {
      const layout = new mxFastOrganicLayout(graph, 2);
      let parent = null;
      graph.getModel().beginUpdate();
      try {
        var doc = mxUtils.parseXml(xml);
        var root = doc.documentElement;
        var dec = new mxCodec(root.owerDocument);
        dec.decode(root, graph.getModel());
        parent = graph.getDefaultParent();
        layout.execute(parent);
      } finally {
        graph.getModel().endUpdate();
      }
    },
    // 记录画布上的组件 防止组件重复
    recordPlugin () {
      // 获取画布上的所有组件
      const parent = graph.getDefaultParent();
      const cells = parent.children;
      if (cells !== null && cells.length > 0) {
        for (let i = 0; i < cells.length; i++) {
          const cell = cells[i];
          const cellName = cell.getAttribute(global.ELEMENT_DEFAULT_ATTRIBUTE_NAME);
          this.tab.refObj.pluginNameMap.set(cellName, cellName);
        }
      }
    },
    // 在解析后的流程上根据属性补充连线上的图片
    drawingByProperties () {
      // 获取画布上的所有组件
      const parent = graph.getDefaultParent();
      const cells = parent.children;
      if (cells !== null && cells.length > 0) {
        if (this.currentModel === global.TRANS_MODEL) {
          this.transDrawingByProperties(cells);
        } else {
          this.jobDrawingByProperties(cells);
        }
      }
    },
    // 在解析后的转换流程上根据属性补充连线上的图片
    async transDrawingByProperties (cells) {
      // 根据数据发送属性画图
      await this.drawingBydataDeliverProperties(cells);
    },
    // 根据数据发送属性在连线上画图
    async drawingBydataDeliverProperties (cells) {
      let overlay = new mxCellOverlay(new mxImage(global.EDGE_ELEMENT_IMAGE_PATH, 16, 16), '');
      // 鼠标样式
      overlay.cursor = 'move';
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        if (!cell.edge) {
          const distributValue = cell.getAttribute('distribute');
          if (distributValue === 'N') {
            const childrenCells = cell.children;
            if (childrenCells.length > 0) {
              for (let i = 0; i < childrenCells.length; i++) {
                const childrenCell = childrenCells[i];
                if (childrenCell.edges) {
                  const edges = childrenCell.edges;
                  for (let j = 0; j < edges.length; j++) {
                    const edge = edges[j];
                    const enabled = edge.getAttribute('enabled');
                    if (enabled === 'Y') {
                      edge.style = 'hop';
                    } else {
                      edge.style = 'hop;disabled';
                    }
                    // graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, global.EDGE_ELEMENT_STYLE_DEFAULT_STROKECOLOR);
                    let overlays = graph.getCellOverlays(edge);
                    overlays = overlay;
                    graph.addCellOverlay(edge, overlays);
                    graph.refresh(edge);
                  }
                }
              }
            }
          }
        }
      }
    },
    // 在解析后的作业流程上根据属性补充连线上的图片
    jobDrawingByProperties (cells) {
      // 根据评价条件画图
      this.drawingByRateCondition(cells);
    },
    // 在解析后的作业流程上根据评价条件在连线上画图
    drawingByRateCondition (cells) {
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        let image = null;
        if (cell.edge) {
          const evaluation = cell.getAttribute('evaluation');
          const unconditional = cell.getAttribute('unconditional');
          if (unconditional === global.EDGE_ELEMENT_ATTRIBUTE_UNCONDITION_TRUE_VALUE) {
            image = global.PLUGIN_STATE_IMAGE_UNCONDITION;
          } else {
            if (evaluation === global.EDGE_ELEMENT_ATTRIBUTE_EVALUATION_TRUE_VALUE) {
              image = global.PLUGIN_STATE_IMAGE_TRUE;
            } else {
              image = global.PLUGIN_STATE_IMAGE_FALSE;
            }
          }
          let overlays = graph.getCellOverlays(cell);
          overlays = new mxCellOverlay(new mxImage(image, 16, 16), '');
          // 鼠标样式
          overlays.cursor = 'move';
          graph.addCellOverlay(cell, overlays);
        }
      }
    },
    // =============================创建相关操作===================================
    // 点击创建作业或转换按钮
    createHandler () {
      this.create.dialogVisible = true;
    },
    // 创建作业
    async createJobHandler () {
      /// 保存当前模式
      this.currentModel = global.JOB_MODEL;
       // 初始化mxGraph
      await this.createInit();
      // 关闭弹框
      this.create.dialogVisible = false;
    },
    // 创建转换
    async createTransHandler () {
      // 保存当前模式
      this.currentModel = global.TRANS_MODEL;
      // 创建初始化
      await this.createInit();
      this.create.dialogVisible = false;
    },
    // 创建初始化
    async createInit (tabName) {
      // 创建标签
      await this.createTab(tabName);
      // 显示左侧菜单及标题部分
      this.leftMenuShow = true;
      // 控制保存 另存为按钮可点击
      this.saveButton.disabled = false;
      // 初始化mxGraph
      this.graphInit();
      // 显示控制
      this.displayHandler(this.currentModel);
      // 关闭弹框
      this.create.dialogVisible = false;
    },
    // 初始化mxGraph
    graphInit () {
      this.$nextTick(() => {
        // 获取创建tab页中的画布容器
        let tontainerRef = this.tab.refObj.$refs['graphContainer'];
        if (tontainerRef) {
          // 调用初始化方法
          mxInit.init(this, this.currentModel, tontainerRef);
          graph = mxInit.getGraph();
          // 保存graph对象
          this.graphList.push(graph);
          // 加载组件菜单
          if (graph) {
            // 将graph,this传到tab页,右键事件js中
            this.deliverVariable(this.tab.refObj);
            this.deliverVariable(popupMenuHandler);
            if (this.currentModel === global.TRANS_MODEL) {
              // 加载转换插件
              this.loadTransPlugins();
            } else {
              // 加载作业插件
              this.loadJobPlugins();
            }
          }
        }
      });
    },
    // 加载作业插件
    async loadJobPlugins () {
      // 加载作业图片
      const jobImages = require('./common/job-images.json');
      if (this.pluginMenu.jobData.length === 0) {
        API.studio.listEntry()
        .then(res => {
          this.pluginMenu.jobData = this.pluginsImageshandler(res.data, jobImages);
          this.addDraggableSource(this.pluginMenu.jobData);
        })
        .catch(error => {
          const errorResultData = error.response.data;
          this.$message({
            message: errorResultData.error.message,
            type: 'warning'
          });
        });
      }
    },
    // 加载转换插件
    async loadTransPlugins () {
      // 加载转换图片
      const transImages = require('./common/trans-images.json');
      if (this.pluginMenu.transData.length === 0) {
        API.studio.listStep()
        .then(res => {
          this.pluginMenu.transData = this.pluginsImageshandler(res.data, transImages);
          this.addDraggableSource(this.pluginMenu.transData);
        })
        .catch(error => {
          const errorResultData = error.response.data;
          this.$message({
            message: errorResultData.error.message,
            type: 'warning'
          });
        });
      }
    },
    // 组件数据添加图片属性
    pluginsImageshandler (pluginsGroup, images) {
      for (let i = 0; i < pluginsGroup.length; i++) {
        const pluginChildren = pluginsGroup[i].children;
        for (let j = 0; j < pluginChildren.length; j++) {
          const plugin = pluginChildren[j];
          for (let z = 0; z < images.length; z++) {
            if (plugin.pluginId === images[z].pluginId) {
              plugin.image = images[z].image;
            }
          }
        }
      }
      return pluginsGroup;
    },
    // 添加可拖拽元素
    addDraggableSource (plugins) {
      var _self = this;
      // 查找当前使用的graph对象
      var graphF = function (evt) {
        var x = mxEvent.getClientX(evt);
        var y = mxEvent.getClientY(evt);
        var elt = document.elementFromPoint(x, y);
        for (var i = 0; i < _self.graphList.length; i++) {
          if (mxUtils.isAncestorNode(_self.graphList[i].container, elt)) {
            return _self.graphList[i];
          }
        }
        return null;
      };
      // 前缀处理，用于拼接refId
      const prefixResult = this.prefixHandler();
      // 遍历菜单组件添加为可拖拽元素
      for (let i = 0; i < plugins.length; i++) {
        const group = plugins[i];
        for (let j = 0; j < group.children.length; j++) {
          const plugin = group.children[j];
          this.$nextTick(() => {
            // 根据refs获取拖拽对象
            const refId = `${prefixResult.prefix}${plugin.pluginId}`;
            const dragElt = this.$refs[refId][0];
            // 设置div 可拖拽 （解决firefox上只能拖拽图片的问题）
            dragElt.draggable = true;
            const imgElt = dragElt.childNodes[0];
            // 创建自定义标签
            const element = this.userDefinedElement(plugin);
            // Function that is executed when the image is dropped on
            // the graph. The cell argument points to the cell under
            // the mousepointer if there is one.
            // 拖拽组件时触发的事件
            var funct = function (graph, evt, cell, x, y) {
              // var parent = graph.getDefaultParent();
              var model = graph.getModel();
              var v = null;
              model.beginUpdate();
              try {
                // NOTE: For non-HTML labels the image must be displayed via the style
                // rather than the label markup, so use 'image=' + image for the style.
                // as follows: v1 = graph.insertVertex(parent, null, label,
                // pt.x, pt.y, 120, 120, 'image=' + image);
                // v = graph.insertVertex(parent, null, labelObj, x, y, 80, 80);
                // v.setConnectable(false);
                // 创建组件
                const style = prefixResult.baseStyle + refId;
                console.log(style);
                v = new mxCell(element, new mxGeometry(0, 0, 40, 40), style);
                v.vertex = true;
                // start组件只允许有一个
                const cellName = v.getAttribute(global.ELEMENT_DEFAULT_ATTRIBUTE_NAME);
                if (cellName === global.JOB_PLUGIN_START) {
                  if (_self.tab.refObj.pluginNameMap.has(cellName)) {
                    _self.$message({
                      message: '一个任务里只能使用一次开始组件',
                      type: 'warning'
                    });
                    return;
                  }
                }
                // v.geometry.alternateBounds = new mxRectangle(0, 0, 120, 40);
                // Adds the ports at various relative locations
                var input = graph.insertVertex(v, null, global.PLUGIN_INPUT_TOOLTIP, 0, 0.5, 12, 12,
                  `port;port-input`, true);
                input.geometry.offset = new mxPoint(-6, -6);
                var output = graph.insertVertex(v, null, global.PLUGIN_OUTPUT_TOOLTIP, 1, 0.5, 12, 12,
                  `port;port-output`, true);
                output.geometry.offset = new mxPoint(-6, -6);
                // 克隆组件
                var cells = graph.importCells([v], x, y, cell);
                if (cells != null && cells.length > 0) {
                  graph.scrollCellToVisible(cells[0]);
                  graph.setSelectionCells(cells);
                }
                // 拖拽多个相同组件时 组件名称不重复的处理
                _self.repeatPluginHandler(cells[0]);
              } finally {
                model.endUpdate();
              }
              // graph.setSelectionCell(v);
            };
            // 添加拖拽元素
            var ds = mxUtils.makeDraggable(dragElt, graphF, funct, imgElt, 0, 0, true, true);
            ds.setGuidesEnabled(true);
            ds.createDragElement = mxDragSource.prototype.createDragElement;
          });
        }
      }
    },
    // 前缀处理
    prefixHandler () {
      // 用于拼接ref
      let prefix = '';
      let baseStyle = null;
      if (this.currentModel === global.TRANS_MODEL) {
        prefix = 'trans-';
        baseStyle = 'step;';
      } else {
        prefix = 'job-';
        baseStyle = 'entry;';
      }
      return { 'prefix': prefix, 'baseStyle': baseStyle };
    },
     // 处理拖拽的重复组件
    repeatPluginHandler (cell) {
      const cellName = cell.getAttribute(global.ELEMENT_DEFAULT_ATTRIBUTE_NAME);
      if (this.tab.refObj.pluginNameMap.has(cellName)) {
        let newName = cellName;
        while (this.tab.refObj.pluginNameMap.has(newName)) {
          const exitNameSuffixNum = this.tab.refObj.pluginNameMap.get(newName).replace(/[^0-9]/ig, '');
          let newSuffixNum = 1;
          if (exitNameSuffixNum) {
            newSuffixNum = parseInt(exitNameSuffixNum);
          }
          newName = this.tab.refObj.pluginNameMap.get(cellName) + (newSuffixNum + 1);
        }
        this.tab.refObj.pluginNameMap.set(newName, newName);
        cell.setAttribute(global.ELEMENT_DEFAULT_ATTRIBUTE_NAME, newName);
      } else {
        this.tab.refObj.pluginNameMap.set(cellName, cellName);
      }
    },
    // 创建自定义组件标签
    userDefinedElement (plugin) {
      var doc = mxUtils.createXmlDocument();
      var element = null;
      if (this.currentModel === global.TRANS_MODEL) {
        element = doc.createElement(global.TRANS_ELEMENT);
      } else if (this.currentModel === global.JOB_MODEL) {
        element = doc.createElement(global.JOB_ELEMENT);
      }
      // 默认属性
      element.setAttribute(global.ELEMENT_DEFAULT_ATTRIBUTE_NAME, plugin.name);
      element.setAttribute(global.ELEMENT_DEFAULT_ATTRIBUTE_TYPE, plugin.type);
      element.setAttribute(global.ELEMENT_DEFAULT_ATTRIBUTE_PLUGIN_ID, plugin.pluginId);
      element.setAttribute(global.ELEMENT_DEFAULT_ATTRIBUTE_DESCRIPTION, '');
      element.setAttribute(global.ELEMENT_DEFAULT_ATTRIBUTE_DISTRIBUTE, 'Y');
      element.setAttribute(global.ELEMENT_DEFAULT_ATTRIBUTE_CUSTOM_DISTRIBUTION, '');
      element.setAttribute(global.ELEMENT_DEFAULT_ATTRIBUTE_COPIES, 1);
      element.setAttribute(global.ELEMENT_DEFAULT_ATTRIBUTE_PARTITIONING, '');
      element.setAttribute(global.ELEMENT_DEFAULT_ATTRIBUTE_ATTRIBUTES, '');
      element.setAttribute(global.ELEMENT_DEFAULT_ATTRIBUTE_CLUSTER_SCHEMA, '');
      element.setAttribute(global.ELEMENT_DEFAULT_ATTRIBUTE_REMOTESTEPS, '');
      element.setAttribute(global.ELEMENT_DEFAULT_ATTRIBUTE_DRAW, 'Y');

      // start dummy组件上添加start,dummy属性进行区分
      if (plugin.pluginId === 'start') {
        element.setAttribute('start', 'Y');
        element.setAttribute('dummy', 'N');
      } else if (plugin.pluginId === 'dummy') {
        element.setAttribute('start', 'N');
        element.setAttribute('dummy', 'Y');
      }
      // 创建保存表单数据的标签
      // var data = doc.createElement(global.SAVE_FORMDATA_ELEMENT);
      // element.appendChild(data);

      // var noteLabel = doc.createElement(noteLabel);
      // noteLabel.setAttribute('type', 'notepad');

      return element;
    },
    // 显示控制
    displayHandler (currentModel) {
      // 显示操作模块隐藏入口模块
      this.pageShow = false;
      if (currentModel === global.TRANS_MODEL) {
        // 显示转换组件菜单
        this.pluginMenu.show = true;
      } else if (currentModel === global.JOB_MODEL) {
        // 显示作业组件菜单
        this.pluginMenu.show = false;
      }
    },
    // 传递graph,this,gloabal到其他js中
    deliverVariable (jsHandler) {
      // 向右键事件js中传递 graph,this
      if (jsHandler.setGraph) {
        jsHandler.setGraph(graph);
      }
      if (jsHandler.setThis) {
        jsHandler.setThis(this);
      }
    },
    // 创建标签页
    async createTab (tabName) {
      let title = '';
      let content = '';
      let type = '';
      if (this.currentModel === global.TRANS_MODEL) {
        title = 'trans';
        content = 'trans-tab';
        type = global.TRANS_MODEL;
      } else if (this.currentModel === global.JOB_MODEL) {
        title = 'job';
        content = 'job-tab';
        type = global.JOB_MODEL;
      }
      if (tabName) {
        title = tabName;
      }
      await this.createTabHandler(title, content, type);
    },
    // 执行创建tab页操作
    async createTabHandler (label, content, type) {
      // 重复tab页名称处理
      let newLable = await this.repeatTabNameHandler(label);
      const newTab = {
        label: newLable,
        name: newLable,
        type: type,
        content: content,
        closable: true
      };
      this.tab.data.push(newTab);
      this.tab.activeName = newLable;
      this.tab.targetName = newLable;
      this.tab.active = newTab;
      // 保存当前创建的tab页组件对象
      this.$nextTick(() => {
        this.tab.refObj = this.$refs[newLable][0];
      });
    },
    // 重复tab页名称处理
    repeatTabNameHandler (label) {
      let newLabel = label;
      let newIndex = 1;
      if (this.tab.nameMap.has(newLabel)) {
        while (this.tab.nameMap.has(newLabel)) {
          const oldIndex = this.tab.nameMap.get(newLabel).replace(/[^0-9]/ig, '');
          if (oldIndex) {
            newIndex = parseInt(oldIndex) + 1;
          }
          newLabel = this.tab.nameMap.get(label) + newIndex;
        }
        this.tab.nameMap.set(newLabel, newLabel);
      } else {
        this.tab.nameMap.set(newLabel, newLabel);
      }
      return newLabel;
    },
    // 点击标签页
    clickTab (tab, event) {
      // 保存当前点击的tab页组件对象
      this.setCurrentTab(tab.name);
      // 查找当前tab页数据
      this.tab.data.forEach((item, index) => {
        if (item.name === tab.name) {
          // 根据类型控制菜单显示
          this.currentModel = item.type;
          // 保存当前点击的tab页数据
          this.tab.active = item;
          this.displayHandler(this.currentModel);
        }
      });
    },
    // 修改tab页名称 并重新指定graph
    async updateTabName (newName) {
      // 从记录tab页名称的map中删除修改之前的tab页名称
      this.tab.nameMap.delete(this.tab.activeName);
      const xml = await studio.getMxGraphXml(graph);
      await this.tab.data.forEach((item, index) => {
        if (item.name === this.tab.activeName) {
          item.name = newName;
          item.label = newName;
          this.tab.active = item;
          this.tab.activeName = newName;
        }
      });
      // 将新的tab页名称添加到map中
      this.tab.nameMap.set(newName, newName);
      this.tab.refObj = this.$refs[newName][0];
      await this.graphInit();
      this.$nextTick(() => {
        // 加载xml
        this.loadTextXml(xml);
        // 记录画布上的组件 防止组件重复
        this.recordPlugin();
        // 在解析后的流程上根据属性补充连线上的图片
        this.drawingByProperties();
      });
    },
    // 关闭标签页
    async removeTab (targetName) {
      const currentTabRefObj = this.$refs[targetName][0];
      this.tab.targetName = targetName;
      if (currentTabRefObj.updateFlag) { // 当前tab页的流程修改标记值为true,提示是否重新保存流程
        // 显示提示信息弹框
        this.messageDialog.visible = true;
        // let confirmResponse = await this.$confirm('文件已发生变化，是否保存', '提示', {
        //   confirmButtonText: '是',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).catch(() => {
        //   this.removeTabDataHandler(targetName);
        // });
        // if (confirmResponse === 'confirm') {
        //   // 保存当前流程
        //   await this.closeTabSaveHandler(targetName);
        // }
      } else {
        // 删除tab页数据
        await this.removeTabDataHandler(targetName);
      }
    },
    // 关闭tab页提示框点击是时的操作
    closeTabSaveConfirm (targetName) {
      this.messageDialog.visible = false;
      this.closeTabSaveHandler(targetName);
    },
    // 关闭tab页提示框点击否时的操作
    closeTabSaveCancel (targetName) {
      this.messageDialog.visible = false;
      this.removeTabDataHandler(targetName);
    },
    // 删除tab页数据
    removeTabDataHandler (targetName) {
      // 获取所有的tab页数据
      let tabs = this.tab.data;
      // 当前激活的tab页
      let activeName = this.tab.activeName;
      let targetTab = null;
      // 当前要删除的tab为激活tab
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            targetTab = tab;
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
              this.tab.active = nextTab;
              // 控制菜单按钮显示
              this.displayHandler(nextTab.type);
            }
          }
        });
        // 重新指定激活页
        this.tab.activeName = activeName;
        // 保存新激活页组件对象
        this.setCurrentTab(activeName);
      } else {  // 当前要删除的tab不是激活tab
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            targetTab = tab;
            // 控制菜单按钮显示
            // this.displayHandler(targetTab.type);
          }
        });
      }
      // 删除tab页数据
      this.tab.data = tabs.filter(tab => tab.name !== targetName);
      // 从记录tab页名称的map中删除该名称
      this.tab.nameMap.delete(targetTab.name);
      // 删除tab页后的一些重置操作
      this.removeTabReset();
    },
    // 删除tab页后的一些重置操作
    removeTabReset () {
      if (this.tab.data.length === 0) {
        // 转换菜单，组件菜单数据置空
        this.pluginMenu.transData = [];
        this.pluginMenu.jobData = [];
        // 隐藏左侧菜单及标题
        this.leftMenuShow = false;
        // 控制保存和另存为按钮不可点
        this.saveButton.disabled = true;
      }
    },
    // 保存当前tab页组件对象，将当前tab页的graph传到右键事件中
    setCurrentTab (tabName) {
      this.tab.targetName = tabName;
      // 将当前点击tab的组件对象赋值到this.tab.refObj
      this.tab.refObj = this.$refs[tabName][0];
      graph = this.tab.refObj.graph;
      // 将当前graph,this传到右键事件js中
      this.deliverVariable(popupMenuHandler);
    },
    // ==========================================组件操作=====================
    // 双击编辑组件
    async editPluginByDoubleClick (cell) {
      this.currentCell = cell;
      if (cell.value.nodeName === global.NOTE_ELEMENT) {
        // 注解组件双击
        this.editNotePluginByDoubleClick(cell);
        return;
      }
      const pluginId = global.ELEMENT_DEFAULT_ATTRIBUTE_PLUGIN_ID;
      const name = global.ELEMENT_DEFAULT_ATTRIBUTE_NAME;
      const componentName = this.currentCell.getAttribute(pluginId);
      const title = this.currentCell.getAttribute(name);
      this.plugin.dialogTitle = title;
      this.plugin.dialogVisible = true;
      this.plugin.show = true;
      const directory = this.currentModel === global.TRANS_MODEL ? 'trans' : 'job';
      const path = this.currentModel === global.TRANS_MODEL ? 'steps' : 'entries';
      this.plugin.component = (resolve) => ({
        component: import(`@/components/studio/${directory}/${path}/${componentName}/index`)
      });
      // 数据回显
      this.dealWithFormData(this.currentCell);
      // let that = this;
      // if (formData) {
      //   const jsonObj = JSON.parse(formData);
      //   jsonObj['name'] = title;
      //   this.currentData = jsonObj;
      //   // setTimeout(() => {
      //   //   var temp = that.$refs.pluginComponent;
      //   //   temp.setEditor(editor);
      //   //   temp.loadData(jsonObj);
      //   // }, 1000);
      // } else {
      //   this.currentData = '';
      //   this.stepName = title;
      //   // setTimeout(() => {
      //   //   var temp = that.$refs.pluginComponent;
      //   //   temp.resetFormData(title);
      //   //   temp.setEditor(editor);
      //   // }, 1000);
      // }
    },
    // 双击编辑注解组件
    editNotePluginByDoubleClick (cell) {
      this.notepad.dialogVisible = true;
      this.notepad.dialogTitle = '注解';
      this.notepad.value = cell.getAttribute(global.ELEMENT_DEFAULT_ATTRIBUTE_NOTE);
      this.currentCell = cell;
    },
    // 处理组件中的表单数据
    dealWithFormData (currentCell) {
      let title = currentCell.getAttribute('name');
      if (this.currentCell.value.innerHTML) {
        var tempNodeStr = this.currentCell.value.innerHTML;
        let textNode = new DOMParser().parseFromString(tempNodeStr, 'text/html').body.childNodes[0];
        let currentData = textNode.getAttribute(global.SAVE_FORMDATA_ELEMENT_ATTRIBUTE);
        const jsonObj = JSON.parse(currentData);
        jsonObj['name'] = title;
        this.currentData = jsonObj;
      } else {
        this.currentData = '';
        this.stepName = title;
      }
    },
    // 保存组件数据
    savePluginData (formData) {
      this.plugin.dialogVisible = false;
      var doc = mxUtils.createXmlDocument();
      var data = doc.createElement(global.SAVE_FORMDATA_ELEMENT);
      data.setAttribute(global.SAVE_FORMDATA_ELEMENT_ATTRIBUTE, JSON.stringify(formData));
      if (this.currentCell.value.innerHTML) {
        this.currentCell.value.innerHTML = data.outerHTML;
      } else {
        this.currentCell.value.appendChild(data);
      }
      this.currentCell.setAttribute(global.ELEMENT_DEFAULT_ATTRIBUTE_NAME, formData.name);
      graph.refresh(this.currentCell);
      // 标签当前流程已修改
      this.tab.refObj.updateFlag = true;
    },
    // 临时保存数据
    saveTempPluginData (formData) {
      var doc = mxUtils.createXmlDocument();
      var data = doc.createElement(global.SAVE_FORMDATA_ELEMENT);
      data.setAttribute(global.SAVE_FORMDATA_ELEMENT_ATTRIBUTE, JSON.stringify(formData));
      if (this.currentCell.value.innerHTML) {
        this.currentCell.value.innerHTML = data.outerHTML;
      } else {
        this.currentCell.value.appendChild(data);
      }
    },
    setChildData () {
      if (this.currentData) {
        this.$refs.pluginComponent.loadData(this.currentData);
        this.$refs.pluginComponent.setGraph(graph);
      } else {
        this.$refs.pluginComponent.resetFormData(this.stepName);
        this.$refs.pluginComponent.setGraph(graph);
      }
    },
    // 点击保存
    async saveClick () {
      // 保存操作
      await this.saveHandler();
    },
    // 点击另存为
    saveAsClick () {
      // 标识当前保存为另存为
      this.saveButton.flag = 'saveas';
      this.openSaveDialog('另存为');
    },
    // 保存操作
    async saveHandler () {
      // 标识当前保存为点击保存按钮保存
      this.saveButton.flag = 'save';
      const name = graph.getDefaultParent().getAttribute('name');
      let result = null;
      if (name) {
        try {
          // 修改流程后直接保存 没有弹框
          result = await this.saveFlow(graph, this.currentModel);
          if (result.status === 200) {
            // 取消流程已修改标记
            this.tab.refObj.updateFlag = false;
            this.$message({
              message: '保存成功',
              type: 'success'
            });
          }
        } catch (error) {
          this.$message({
            message: '保存失败',
            type: 'warning'
          });
        }
      } else {
        // 打开保存弹框 填写名称 选择路径
        this.openSaveDialog('保存流程');
      }
    },
    // 关闭标签页时保存流程
    async closeTabSaveHandler (targetName) {
      // 标识当前保存流程为关闭tab页时的保存
      this.saveButton.flag = 'close';
      // 关闭提示弹框
      let currentGraph = this.$refs[targetName][0].graph;
      const name = currentGraph.getDefaultParent().getAttribute('name');
      let result = null;
      let targetTab = null;
      if (name) {
        try {
          // 获取当前操作的tab页
          await this.tab.data.forEach((item, index) => {
            if (item.name === targetName) {
              targetTab = item;
            }
          });
          // 修改流程后直接保存 没有弹框
          result = await this.saveFlow(currentGraph, targetTab.type);
          if (result.status === 200) {
            // 删除tab页相关操作
            this.removeTabDataHandler(targetName);
            this.$message({
              message: '保存成功',
              type: 'success'
            });
          }
        } catch (error) {
          this.$message({
            message: '保存失败',
            type: 'warning'
          });
        }
      } else {
        // 打开保存弹框 填写名称 选择路径
        this.openSaveDialog();
      }
    },
    // 打开保存弹框 填写名称 选择路径
    openSaveDialog (ttitle) {
      // 第一次保存流程 弹框 填写名称 选择路径
      this.flow.dialogVisible = true;
      this.flow.dialogTitle = ttitle;
      this.$nextTick(() => {
        this.$refs['flow'].reset();
      });
    },
    // 保存弹框中点击确定操作
    async saveSubmit () {
      // 名称，路径保存到标签中
      await this.$refs['flow'].validateForm();
      // 获取当前操作的tab组件的graph
      const currentGraph = this.$refs[this.tab.targetName][0].graph;
      let result = null;
      let targetTab = null;
      if (this.$refs['flow'].flowForm.validateFlag) {
        const flowForm = this.$refs['flow'].flowForm;
        currentGraph.getDefaultParent().setAttribute('name', flowForm.name);
        currentGraph.getDefaultParent().setAttribute('directory', flowForm.path);
        try {
          // 获取当前操作的tab页
          await this.tab.data.forEach((item, index) => {
            if (item.name === this.tab.targetName) {
              targetTab = item;
            }
          });
          // 保存流程
          result = await this.saveFlow(currentGraph, targetTab.type);
          if (result.status === 200) {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            if (this.saveButton.flag === 'close') { // 当前为关闭tab页操作 保存流程后再进行关闭tab页的相关操作
              await this.removeTabDataHandler(this.tab.targetName);
            } else if (this.tab.data.length > 0) {
              // 修改当前tab页名称
              this.updateTabName(flowForm.path + '/' + flowForm.name);
            }
          }
          // 关闭弹框
          this.flow.dialogVisible = false;
        } catch (error) {
          this.$message({
            message: '保存失败',
            type: 'warning'
          });
          console.log(error);
        }
      }
    },
    // 保存流程的xml
    async saveFlow (graph, type) {
      const xml = await studio.getMxGraphXml(graph);
      if (type === global.TRANS_MODEL) {
        // this.saveTrans(xml);
        return API.trans.save(xml);
      } else {
        // this.saveJob(xml);
        return API.job.save(xml);
      }
    },
    // ========================================弹框相关操作=====================
    // 创建注解
    createNotepadHandler () {
      popupMenuHandler.createNotepadHandler(this.currentCell);
    },
    /**
     * 编辑组件描述信息
     */
    editDiscriptionHandler () {
      this.currentCell.setAttribute(global.ELEMENT_DEFAULT_ATTRIBUTE_DESCRIPTION, this.discription.value);
      graph.refresh(this.currentCell);
      this.discription.dialogVisible = false;
    },
    // =============================其他操作===================================
    // 动态设置页面高度
    getPageHeight () {
      this.pageHeight = this.$refs['studioView'].parentElement.clientHeight - 20 + 'px';
    },
    // 标记当前流程已做修改
    setUpdateFlag () {
      this.tab.refObj.updateFlag = true;
    }
  },
  mounted () {
    this.getPageHeight();
  }
};
</script>
<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
}
.studioView {
  overflow: auto;
  width: 100%;
  .u-card-enter {
    width: 400px;
    height: 300px;
    text-align: center;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .u-button-enter {
    width: 70%;
    margin-top: 65px;
    margin-left: 5px;
    left: 50%;
  }
  .u-button-enter2 {
    width: 70%;
    margin-top: 65px;
    margin-left: 15%;
  }
  .main {
    height: 100%;
    .el-header {
      height: 40px !important;
    }
    .el-aside {
      width: 240px !important;
      border: 3px solid #ebeef5;
      padding: 0 5px 5px 5px;
      .u-menu-title {
        height: 40px;
        padding: 0 0 0 15px;;
        line-height: 40px;
      }
      .u-dropdown-div {
        height: 40px;
        padding: 0 5px 0 15px;
        line-height: 40px;
        border-bottom: 1px solid #ebeef5;
        .el-dropdown {
          margin-right: 10px !important;
        }
        .u-button {
          padding: 5px 8px;
        }
      }
      .el-collapse {
        width: 200px;
        .el-collapse-item__header {
          padding: 0 5px 0 15px;
        }
      }
      .u-plugin-div {
        padding-left: 10px;
      }
      .u-plugin-div:hover {
        background-color:#ecf5ff;
        color:#66b1ff;
        padding-left: 20px;
        cursor: pointer;
      }
    }
    .el-main {
      height: 100%;
      padding : 0;
      // overflow: initial;
      border-top: 3px solid #ebeef5;
      border-right: 3px solid #ebeef5;
      border-bottom: 3px solid #ebeef5;
      .el-tabs {
        height: 100%;
        display: -webkit-box; /* Chrome 4+, Safari 3.1, iOS Safari 3.2+ */  
        display: -moz-box; /* Firefox 17- */  
        display: -webkit-flex; /* Chrome 21+, Safari 6.1+, iOS Safari 7+, Opera 15/16 */  
        display: -moz-flex; /* Firefox 18+ */  
        display: -ms-flexbox; /* IE 10 */  
        display: flex; /* Chrome 29+, Firefox 22+, IE 11+, Opera 12.1/17/18, Android 4.4+ */  
        -webkit-box-direction: normal;
        -webkit-box-orient: vertical;
        -moz-flex-direction: column;
        -webkit-flex-direction: column;
        flex-direction: column;
        // margin-right: -2px;
        .el-tabs__header {
          margin: 0;
          height: 40px;
          .el-tabs__nav {
            border-top: none;
            border-left: none;
            border-radius: 0;
          }
        }
        .el-tabs__content {
          flex: 1;
          .el-tab-pane {
            height: 100%;
            // .u-scrollbar-component {
            //   height: 100%;
            //   .el-scrollbar__wrap {
            //     overflow: auto;
            //     .el-scrollbar__view {
            //       height: 100%;
            //     }
            //   }
            // }
          }
        }
      }
      // .el-tabs__item {
      //   height: 30px;
      //   line-height: 30px;
      // }
    }
  }
  // 查看图形文件
  .u-textarea {
    padding-bottom: 10px;
  }
  .u-message-dialog {
    // height: 136px !important;
    padding-bottom: 10px;
    margin-top: 25vh !important;
    .el-dialog__header {
      padding: 10px 20px 0px;
    }
    .el-dialog__body {
      padding: 5px 20px 10px;
    }
  }
}
// 右键菜单
body div.mxPopupMenu {
  background: white;
  position: absolute;
  border: 1px solid #e7e7e7;
  padding: 1px;
}
body table.mxPopupMenu {
  border-collapse: collapse;
  margin: 0px;
}
body tr.mxPopupMenuItem {
  color: black;
  cursor: default;
}
body td.mxPopupMenuItem {
  padding: 6px 60px 6px 30px;
  font-family: Arial;
  font-size: 10pt;
}
body td.mxPopupMenuIcon {
  background-color: white;
  padding: 0px;
}
body tr.mxPopupMenuItemHover {
  background-color: #eeeeee;
  color: black;
}
table.mxPopupMenu hr {
  border-top: solid 1px #cccccc;
}
table.mxPopupMenu tr {
  font-size: 4pt;
}
</style>