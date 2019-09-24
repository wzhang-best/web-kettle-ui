/* 作业tab页 */
<template>
  <!-- <div class="jobView" ref="jobView" :style="pageStyle"> -->
  <div class="jobView" ref="jobView" :style="pageStyle">
    <!-- 头部 -->
    <div class="u-button-div">
      <el-tooltip content="执行" placement="bottom" effect="light">
        <el-button class="u-button" @click="handleRunClick" :disabled="button.runDisabled">
          <icon-svg name="run"></icon-svg>
        </el-button>
      </el-tooltip>
      <el-tooltip content="停止" placement="bottom" effect="light">
        <el-button class="u-button" @click="handleStopClick" :disabled="button.stopDisabled">
          <icon-svg name="stop"></icon-svg>
        </el-button>
      </el-tooltip>
    </div>
    <el-scrollbar class="u-scrollbar">
      <!-- 画布 -->
      <div
        id="graph-container"
        ref="graphContainer"
        class="u-graph-container"
        :style="containerStyle">
        <!-- :style="{ background: 'url(' + (containerImagePath) + ')'}"> -->
      </div>
      <!-- 控制台 -->
      <div class="u-footer">
        <el-tabs type="border-card">
          <!-- <el-tab-pane label="执行历史"></el-tab-pane> -->
          <el-tab-pane label="日志">
            <div>
              <el-input
                class="u-footer-log"
                type="textarea"
                readonly
                resize = "none"
                v-model="consoleD.logText"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane label="作业度量">
            <el-table
              class="u-tab-table"
              ref="tabTable"
              :data="consoleD.metricData"
              height="197"
              stripe
              row-key="name"
              border
              default-expand-all
              tooltip-effect="dark"
              :tree-props="{ children: 'children' }">
              <el-table-column v-if="(consoleD.metric.index !== false)"
                fixed
                type="index"
                width="50"
                header-align="center"
                align="center">
              </el-table-column>
              <template v-for="(column, index) in consoleD.metric.columns">
                <el-table-column v-if="((!column.type || column.type==='normal') && (column.visible!==false))"
                  :key="index"
                  :prop="column.prop"
                  :label="column.label"
                  width="140"
                  :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column v-if="((index === consoleD.metric.columns.length-1) && (column.visible!==false))"
                  :key="index"
                  :prop="column.prop"
                  :label="column.label"
                  min-width="140"
                  :show-overflow-tooltip="true">
                </el-table-column>
              </template>
            </el-table>
          </el-tab-pane>
          <!-- <el-tab-pane label="性能图"></el-tab-pane> -->
          <!-- <el-tab-pane label="Metrics"></el-tab-pane> -->
          <!-- <el-tab-pane label="数据预览"></el-tab-pane> -->
        </el-tabs>
      </div>
    </el-scrollbar>
  </div>
</template>
<script>
/* eslint semi: ["error", "always"] */
/* eslint-disable no-new-object */
/* eslint-disable new-cap */
import API from '@/api';
import * as studio from '@/views/modules/studio/js/studio-handler.js';
// 全局常量
import * as global from '@/views/modules/studio/common/common.js';
// import * as mxInit from '@/views/modules/studio/graph/graph.js';
let _self = null;
export default {
  data () {
    return {
      consoleD: {
        logText: '',
        metric: [],
        metricData: [],
        execute: null, // 接收定时器
        executeStatus: false // 执行状态
      },
      containerImagePath: global.CONTAINER_IMAGE_PATH,
      pluginNameMap: new Map(),
      graph: null, // 保存mxGraph对象
      containerStyle: { // 画布样式
        background: 'url(' + (global.CONTAINER_IMAGE_PATH) + ')',
        minHeight: ''
      },
      pageStyle: { // 页面样式
        height: ''
      },
      button: {
        runDisabled: false, // 控制执行按钮点击
        stopDisabled: true // 控制停止按钮点击
      },
      editFlag: false // 流程修改标记
    };
  },
  computed: {
    'executeStatus' () {
      return this.consoleD.executeStatus;
    }
  },
  watch: {
    'executeStatus' () {
      clearInterval(this.consoleD.execute);
    }
  },
  methods: {
    setGraph (graph) {
      this.graph = graph;
    },
    setThis (value) {
      _self = value;
    },
    // 执行
    async handleRunClick () {
      // 获取xml
      const xml = await studio.getMxGraphXml(this.graph);
      this.handlerJobRun(xml);
      // 设置当前标签页不可关闭 执行按钮不可点 停止按钮可点
      this.setStatus('run', true, false);
    },
    // 作业执行
    handlerJobRun (xml) {
      this.resetJob();
      // 根据xml执行转换
      API.job.run(xml).then(res => {
        const resultStatus = res.status + '';
        if (resultStatus.substring(0, 1) === '2') {
          // 获取执行日志
          const executionId = res.data.executionId;
          if (executionId) {
            // 获取执行结果
            // this.jobExecuteResult(executionId);
            // 调用定时器
            this.jobExecuteTimer(executionId);
          } else {
            // 设置当前标签页可关闭 执行按钮可点 停止按钮置灰
            this.setStatus('run', false, true);
          }
        } else {
          this.$message({
            message: res.data.error.message,
            type: 'warning'
          });
          // 清除定时器
          clearInterval(this.consoleD.execute);
          // 设置当前标签页可关闭 执行按钮可点 停止按钮置灰
          this.setStatus('run', false, true);
        }
      });
    },
    // 作业调用执行结果定时器
    jobExecuteTimer (executionId) {
      this.consoleD.execute = window.setInterval(() => {
        this.jobExecuteResult(executionId);
      }, global.METRICS_INTERVAL);
    },
    // 获取作业执行结果
    jobExecuteResult (executionId) {
      const params = {
        executionId: executionId
      };
      API.job.executeResult(params)
      .then(res => {
        // 处理返回的日志数据并显示
        this.consoleD.logText = res.data.logging;
        // 处理度量数据并显示
        this.consoleD.metricData = res.data.metrics;
        // 显示组件的执行状态
        studio.changePluginState(res.data.status, this.graph);
        // 执行状态
        this.consoleD.executeStatus = res.data.finished;
        console.log(this.consoleD.executeStatus);
        if (this.consoleD.executeStatus) {
          // 设置当前标签页可关闭 执行按钮可点 停止按钮置灰
          this.setStatus('run', false, true);
        }
      })
      .catch(error => {
        const errorResultData = error.response.data;
        // 清除定时器
        clearInterval(this.consoleD.execute);
        this.$message({
          message: errorResultData.error.message,
          type: 'warning'
        });
        // 设置当前标签页可关闭 执行按钮可点 停止按钮置灰
        this.setStatus('run', false, true);
      });
    },
    /**
     * @param {Object} button 按钮类别 （run, stop, pause）
     * @param {Object} buttonStatus 按钮可点击属性值
     * @param {Object} closeStatus 父组件中tab标签页的关闭属性
     */
    setStatus (button, buttonStatus, closeStatus) {
      // 设置当前标签页可关闭
      _self.tab.active.closable = closeStatus;
      if (button === 'run') {
        // 执行按钮可点 停止 暂停按钮置灰
        this.button.runDisabled = buttonStatus;
        this.button.stopDisabled = !buttonStatus;
      } else if (button === 'stop') {
        this.button.stopDisabled = buttonStatus;
        this.button.runDisabled = !buttonStatus;
      }
    },
    // 重置作业控制台数据
    resetJob () {
      // 清空日志
      this.consoleD.logText = '';
      // 清空步骤度量列表数据
      this.consoleD.metricData = [];
      // 重置执行状态
      this.consoleD.executeStatus = false;
      // 清空组件执行状态图片
      studio.clearPluginOverlays(this.graph);
    },
    // 停止执行
    handleStopClick () {
      // 设置当前标签页可关闭 停止按钮不可点 执行按钮可点
      this.setStatus('stop', true, true);
    },
    /**
     * 初始化
     */
    async init () {
      // 加载作业度量列表字段
      this.consoleD.metric = require('@/views/modules/studio/common/job-metrics-table.json');
      // this.getPageHeight();
    },
    // 动态设置页面高度
    getPageHeight () {
      this.pageStyle.height = this.$refs['jobView'].parentElement.clientHeight + 'px';
      this.containerStyle.minHeight = this.$refs['jobView'].parentElement.clientHeight - 250 - 40 + 'px';
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.init();
    });
  },
  // 父组件渲染后设置高度 (写在mounted中 chrome中获取父的高度一直为0)
  updated () {
    this.$nextTick(() => {
      this.getPageHeight();
    });
  }
};
</script>
<style lang="scss">
.jobView {
  display: flex;
  flex-direction: column;
  .u-button-div {
    height: 40px;
    padding: 0 5px 0 5px;
    line-height: 40px;
    .u-button {
      padding: 5px 12px;
    }
  }
  .u-scrollbar {
    flex: 1;
    .el-scrollbar__wrap {
      overflow: auto;
    }
    .el-scrollbar__view {
      height: 100%;
      // display: flex;
      // flex-direction: column;
      .u-footer {
        height: 250px !important;
        -webkit-margin-end: 5px;
        -moz-margin-end: 13px;
        .el-tabs--border-card {
          height: 100%;
          border-left: none;
          .el-tabs__content {
            padding: 6px !important;
          }
        }
        .u-footer-log {
          height: 195px !important;
          // padding-right: 15px;
          .el-textarea__inner {
            height: 195px;
          }
        }
      }
      .u-graph-container {
        // flex: 1;
        padding: 0px;
        cursor: default;
      }
    }
  }
}
</style>