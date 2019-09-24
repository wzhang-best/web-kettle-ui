<template>
  <div>
    <!--数据表图表-->
    <el-card class="box-card" style="margin-top: 20px">
      <div slot="header" class="card-head">
        <span>数据源采集表数量统计</span>
      </div>
      <div id="tableCountBar" style="width: 100%;height: 400px" ></div>
    </el-card>

    <el-card class="box-card" style="margin-top: 20px">
      <div slot="header" class="card-head">
        <span>平台新增表数据量统计</span>
      </div>
      <div id="tableCountLine" style="width: 100%;height: 400px" ></div>
    </el-card>

   <!-- <el-card class="box-card" style="margin-top: 20px">
      <div slot="header" class="card-head">
        <span>通过各数据采集的表数量占比统计</span>
      </div>
      <div id="tableCountPie" style="width: 100%;height: 400px" ></div>
    </el-card>-->
  </div>

</template>

<script>
  import echarts from 'echarts'
  export default {

    data () {
      return {
        dataSourceName: [],
        tableCount: [],
        monthName: [],
        monthCount: []
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
          url: this.$http.adornUrl('/home/queryTableData'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          for (var i = 0; i < data.result.tableList.length; i++) {
            this.dataSourceName.push(data.result.tableList[i].name)
            this.tableCount.push(data.result.tableList[i].tableCount)
          }
          for (i = 0; i < data.result.month.length; i++) {
            this.monthName.push(data.result.month[i].year + '-' + data.result.month[i].month)
            this.monthCount.push(data.result.month[i].count)
          }
          this.showTableBar()
          this.showTableLine()
        }).then(() => {
          this.datasourceChartHandle()
        })
      },

      showTableBar () {
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
              name: '采集表数量',
              type: 'bar',
              barWidth: '60%',
              data: this.tableCount
            }
          ]
        }

        bar.chartGraph = echarts.init(document.getElementById('tableCountBar'))
        bar.chartGraph.setOption(bar.option)
      },

      showTableLine () {
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
            data: this.monthName
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '新增表数量',
              type: 'line',
              areaStyle: {
                color: '#4da0e1'
              },
              label: {
                normal: {
                  show: true
                }
              },
              data: this.monthCount
            }
          ]
        }

        line.chartGraph = echarts.init(document.getElementById('tableCountLine'))
        line.chartGraph.setOption(line.option)
      },

      showTablePie () {
        var pie = {}
        pie.option = {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['数据源1', '数据源2', '数据源3', '数据源4', '数据源5', '数据源6', '数据源7', '数据源8', '数据源9']
          },
          series: [
            {
              name: '表数量',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                {value: 1000, name: '数据源1'},
                {value: 900, name: '数据源2'},
                {value: 800, name: '数据源3'},
                {value: 700, name: '数据源4'},
                {value: 600, name: '数据源5'},
                {value: 500, name: '数据源6'},
                {value: 400, name: '数据源7'},
                {value: 300, name: '数据源8'},
                {value: 200, name: '数据源9'}
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }

        pie.chartGraph = echarts.init(document.getElementById('tableCountPie'))
        pie.chartGraph.setOption(pie.option)
      }
    }
  }
</script>

<style scoped>

</style>
