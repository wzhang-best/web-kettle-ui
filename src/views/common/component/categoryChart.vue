<template>
  <div>
    <el-card class="box-card" style="margin-top: 20px">
      <div slot="header" class="card-head">
        <span>资源目录统计</span>
      </div>
      <div id="categoryTJBar" style="width: 100%;height: 400px" ></div>
    </el-card>

    <el-card class="box-card" id="dir-card" style="margin-top: 20px">
      <div slot="header" class="card-head">
        <span style="padding-left: 5px;">资源目录</span>
        <span style="position: absolute; right: 20px; font-size: 24px; cursor:pointer;" @click="maxView">
          <icon-svg v-if="isFull" name="normal"></icon-svg>
          <icon-svg v-else="isFull" name="max"></icon-svg>
        </span>
      </div>
      <div id="categoryChart" style="width: 100%; min-height: 600px" ></div>
    </el-card>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        isFull: false,
        tableList: [],
        tableNameList: [],
        recordList: [],
        fieldList: [],
        dirList: [],
        tableCountList: [],
        dataSetCountList: [],
        categoryChart: null
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.initDataChart()
        this.getCategoryChartInit()
        window.onresize = () => {
          if (this.isFullScreen()) {
            this.isFull = true
          } else {
            this.isFull = false
          }
        }
      })
    },
    activated () {
    },
    methods: {
      initDataChart () {
        this.$http({
          url: this.$http.adornUrl('/home/queryDirData'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.dirList = data.result.dirList
          this.tableCountList = data.result.tableCountList
          this.dataSetCountList = data.result.dataSetCountList

          this.showCategoryBar()
        })
      },
      showCategoryBar () {
        var bar = {}
        bar.option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['表数量', '数据集数量']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          color: ['#4da0e1', '#ffbb12', '#dc50ac', '#5fb29f', '#dc7057'],
          yAxis: {
            type: 'value'
          },
          xAxis: [{
            axisLabel: {
              rotate: 25
            },
            type: 'category',
            data: this.dirList
          }],
          series: [
            {
              name: '表数量',
              type: 'bar',
              barWidth: '20%',
              data: this.tableCountList
            },
            {
              name: '数据集数量',
              type: 'bar',
              barWidth: '20%',
              data: this.dataSetCountList
            }
          ]
        }

        bar.chartGraph = echarts.init(document.getElementById('categoryTJBar'))
        bar.chartGraph.setOption(bar.option)
      },

      getCategoryChartInit () {
        this.$http({
          url: this.$http.adornUrl('/bss/dir/selectCategoryTree'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.tableList = treeDataTranslate(data.tree)
          // this.dataSourceList = data.list
        }).then(() => {
          this.renderChart()
        })
      },

      renderChart () {
        for (var a in this.tableList) {
          this.tableNameList.push(this.tableList[a].tableName)
        }
        // for (var i = 0; i < this.tableNameList.length; i++) {
        //   this.recordList.push(Math.round(Math.random() * 1430) + 25)
        //   this.fieldList.push(Math.round(Math.random() * 20) + 4)
        // }
        const categoryChart = echarts.init(document.getElementById('categoryChart'))
        this.categoryChart = categoryChart
        categoryChart.showLoading()
        var categoryOption = {
          tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
          },
          series: [
            {
              initialTreeDepth: 1,
              expandAndCollapse: true,
              type: 'tree',
              data: this.tableList,
              top: '1%',
              left: '80',
              bottom: '1%',
              right: '120',
              symbolSize: 13,
              label: {
                normal: {
                  position: 'left',
                  verticalAlign: 'middle',
                  align: 'right',
                  fontSize: 12
                }
              },
              leaves: {
                label: {
                  normal: {
                    position: 'right',
                    verticalAlign: 'middle',
                    align: 'left'
                  }
                }
              },
              itemStyle: {
                borderColor: '#36a3f7'
              },
              animationDuration: 550,
              animationDurationUpdate: 750
            }
          ]
        }
        // var mockData1 = {'name': '小米11', 'symbol': 'circle', 'cusField': 'product', 'itemStyle': {'normal': {'label': {'show': true, 'position': 'right'}}}}
        categoryChart.setOption(categoryOption)
        categoryChart.hideLoading()
        var that = this
        categoryChart.on('click', function (param) {
          var container = document.getElementById('categoryChart')
          var allNode = 0
          var nodes = categoryChart._chartsViews[0]._data._graphicEls
          for (var i = 0, count = nodes.length; i < count; i++) {
            var node = nodes[i]
            if (node === undefined) { continue }
            allNode++
          }
          if (!that.isFullScreen()) {
            var currentHeight = 25 * allNode
            container.style.height = currentHeight + 'px'
            categoryChart.resize()
          }
        })
      },
      maxView () {
        var container = document.getElementById('dir-card')
        var chart = document.getElementById('categoryChart')

        if (this.isFullScreen()) {
          if (document.exitFullscreen) {
            document.exitFullscreen()
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
          }
          chart.style.width = document.body.clientWidth - 270 + 'px'
        } else {
          if (container.requestFullscreen) {
            container.requestFullscreen()
          } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen()
          } else if (container.mozRequestFullScreen) {
            container.mozRequestFullScreen()
          } else if (container.msRequestFullscreen) {
            container.msRequestFullscreen()
          }
          chart.style.height = document.body.clientHeight + 'px'
          chart.style.width = document.body.clientWidth + 'px'
        }
        this.categoryChart.resize()
      },
      isFullScreen () {
        return document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen
        // return document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled
      }
    }
  }
</script>

<style scoped>

</style>
