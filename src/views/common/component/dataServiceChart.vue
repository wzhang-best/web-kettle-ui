<template>
  <div>
    <el-card class="box-card" style="margin-top: 20px">
      <div slot="header" class="card-head">
        <span>各数据源提供的服务数量统计</span>
      </div>
      <div id="dataServiceCountBar" style="width: 100%;height: 400px" ></div>
    </el-card>

    <el-card class="box-card" style="margin-top: 20px">
      <div slot="header" class="card-head">
        <span>服务访问量分布</span>
      </div>
      <div id="dataServiceLine" style="width: 100%;height: 400px" ></div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <div slot="header" class="card-head">
            <span>服务调用次数TOP5</span>
          </div>
          <div id="dataServiceCellBar" style="height: 400px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header" class="card-head">
            <span>服务订阅量TOP5</span>
          </div>
          <div id="dataServiceSubscribeBar" style="height: 400px;"></div>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import echarts from 'echarts'
  export default {

    data () {
      return {
        dataSourceName: [],
        serviceCount: [],
        TOPServiceName: [],
        TOPServiceCell: [],
        radomList: [],
        hourName: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        hourCount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.initDataChart()
      })
    },
    activated () {
    },

    methods: {
      initDataChart () {
        this.$http({
          url: this.$http.adornUrl('/home/queryServiceData'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.dataSourceList = data.result.serviceList
          for (var i = 0; i < data.result.serviceList.length; i++) {
            this.dataSourceName.push(data.result.serviceList[i].name)
            this.serviceCount.push(data.result.serviceList[i].serviceCount)
          }
          var top = data.result.top.length < 5 ? data.result.top.length : 5
          for (i = 0; i < top; i++) {
            this.TOPServiceName.push(data.result.top[i].serviceName)
            this.TOPServiceCell.push(data.result.top[i].count)
            this.radomList.push(parseInt(Math.random() * 100))
          }
          for (i = 0; i < data.result.hour.length; i++) {
            this.hourCount[data.result.hour[i].hour] = data.result.hour[i].count
          }
          this.showDataServiceCount()
          this.showDataServiceLine()
          this.showDataServiceCellBar()
          this.showDataServiceSubscribeBar()
        })
      },

      showDataServiceCount () {
        var bar = {}
        bar.option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          color: ['#4da0e1'],
          yAxis: {
            type: 'value'
          },
          xAxis: [{
            axisLabel: {
              rotate: 25
            },
            type: 'category',
            data: this.dataSourceName
          }],
          series: [
            {
              name: '创建数据服务数量',
              type: 'bar',
              barWidth: '60%',
              data: this.serviceCount
            }
          ]
        }
        bar.chartGraph = echarts.init(document.getElementById('dataServiceCountBar'))
        bar.chartGraph.setOption(bar.option)
      },

      showDataServiceLine () {
        var line = {}
        line.option = {
          tooltip: {
            trigger: 'axis'
          },
          color: ['#4da0e1'],
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.hourName
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '服务访问次数',
              type: 'line',
              areaStyle: {
                color: '#4da0e1'
              },
              label: {
                normal: {
                  show: true
                }
              },
              data: this.hourCount
            }
          ]
        }

        line.chartGraph = echarts.init(document.getElementById('dataServiceLine'))
        line.chartGraph.setOption(line.option)
      },

      showDataServiceCellBar () {
        var bar = {}
        bar.option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          color: ['#4da0e1'],
          xAxis: {
            type: 'value'
          },
          yAxis: [{
            type: 'category',
            data: this.TOPServiceName
          }],
          series: [
            {
              name: '服务调用次数',
              type: 'bar',
              barWidth: '60%',
              data: this.TOPServiceCell
            }
          ]
        }
        bar.chartGraph = echarts.init(document.getElementById('dataServiceCellBar'))
        bar.chartGraph.setOption(bar.option)
      },

      showDataServiceSubscribeBar () {
        var bar = {}
        bar.option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          color: ['#4da0e1'],
          xAxis: {
            type: 'value'
          },
          yAxis: [{
            type: 'category',
            data: this.TOPServiceName
          }],
          series: [
            {
              name: '服务订阅数量',
              type: 'bar',
              barWidth: '60%',
              data: this.radomList
            }
          ]
        }
        bar.chartGraph = echarts.init(document.getElementById('dataServiceSubscribeBar'))
        bar.chartGraph.setOption(bar.option)
      }

    }
  }
</script>

<style scoped>

</style>
