<template>
  <div>
    <el-card class="box-card" style="margin-top: 20px">
      <div slot="header" class="card-head">
        <span>通过各数据源创建的数据集数量统计</span>
      </div>
      <div id="dataSetBar" style="width: 100%;height: 400px" ></div>
    </el-card>

    <el-card class="box-card" style="margin-top: 20px">
      <div slot="header" class="card-head">
        <span>数据集增量统计</span>
      </div>
      <div id="dataSetZLBar" style="width: 100%;height: 400px" ></div>
    </el-card>

    <el-card class="box-card" style="margin-top: 20px">
      <div slot="header" class="card-head">
        <span>数据量最多的数据集</span>
      </div>
      <div id="dataSetMaxBar" style="width: 100%;height: 400px" ></div>
    </el-card>
  </div>
</template>

<script>
  import echarts from 'echarts'
  export default {

    data () {
      return {
        dataSourceName: [],
        count: [],
        TOPName: [],
        TOPCount: [],
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
          url: this.$http.adornUrl('/home/queryDataSetData'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          for (var i = 0; i < data.result.dataSetList.length; i++) {
            this.dataSourceName.push(data.result.dataSetList[i].name)
            this.count.push(data.result.dataSetList[i].dataSetCount)
          }

          var top = data.result.top.length < 10 ? data.result.top.length : 10
          for (i = 0; i < top; i++) {
            this.TOPName.push(data.result.top[i].bssName)
            this.TOPCount.push(data.result.top[i].value)
          }
          for (i = 0; i < data.result.month.length; i++) {
            this.monthName.push(data.result.month[i].year + '-' + data.result.month[i].month)
            this.monthCount.push(data.result.month[i].count)
          }
          this.showDataSetBar()
          this.showDataSetZLBar()
          this.showDataSetMaxBar()
        })
      },

      showDataSetBar () {
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
              name: '数据源创建数据集数量',
              type: 'bar',
              barWidth: '60%',
              data: this.count
            }
          ]
        }

        bar.chartGraph = echarts.init(document.getElementById('dataSetBar'))
        bar.chartGraph.setOption(bar.option)
      },

      showDataSetZLBar () {
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
            type: 'category',
            data: this.monthName
          }],
          series: [
            {
              name: '数据集增量',
              type: 'bar',
              barWidth: '60%',
              data: this.monthCount
            }
          ]
        }

        bar.chartGraph = echarts.init(document.getElementById('dataSetZLBar'))
        bar.chartGraph.setOption(bar.option)
      },

      showDataSetMaxBar () {
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
          xAxis: {
            axisLabel: {
              rotate: 25
            },
            type: 'category',
            data: this.TOPName
          },
          series:
          {
            name: '数据集中数据量',
            type: 'bar',
            barWidth: '60%',
            data: this.TOPCount
          }

        }

        bar.chartGraph = echarts.init(document.getElementById('dataSetMaxBar'))
        bar.chartGraph.setOption(bar.option)
      }

    }
  }
</script>

<style scoped>

</style>
