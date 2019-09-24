<template>
  <div>
    <!--数据源图表-->
    <el-card class="box-card" style="margin-top: 20px">
      <div slot="header" class="card-head">
        <span>数据源数据总量统计</span>
      </div>
      <div id="datasourceSumChart" style="width: 100%;height: 400px" ></div>
    </el-card>

    <el-card style="margin-top: 20px">
      <div slot="header" class="card-head">
        <span>数据源实时状态</span>
      </div>
      <div id="datasourceStatueChart" style="width: 100%;height: 400px" >
        <el-row :gutter="20">
          <el-col :span="4" v-for="(project,index) in this.dataSourceList" :key="index"  style="margin-bottom:20px; min-width: 280px;">
            <el-card  v-if="project.isConnect === 1" shadow="always" style="cursor: pointer;margin-left:10px;height:160px;border:3px solid #699bf5">
              <div style="height: 160px; " @click="dataSourceClick(project.id,project.type, project.name)">
                <div>
                  <div>
                    <div style="height: 50px; text-align: left">
                     <font COLOR="#324ded" size="5">{{project.name}}</font>
                    </div>
                  </div>
                  <div  >
                      <icon-svg v-if="project.type === 1" name="db_oracle" class-name="card-button-icon"></icon-svg>
                      <icon-svg v-if="project.type === 2" name="db_mssql" class-name="card-button-icon"></icon-svg>
                      <icon-svg v-if="project.type === 3" name="db_mysql" class-name="card-button-icon" ></icon-svg>
                      <icon-svg v-if="project.type === 4" name="db_db2" class-name="card-button-icon" ></icon-svg>
                      <icon-svg v-if="project.type === 5" name="db_dm1" class-name="card-button-icon" ></icon-svg>
                      <icon-svg v-if="project.type === 6" name="db_gbase" class-name="card-button-icon"></icon-svg>
                      <icon-svg v-if="project.type === 7" name="db_postgresql" class-name="card-button-icon" ></icon-svg>
                      <icon-svg v-if="project.type === 8" name="db_sybase1" class-name="card-button-icon"></icon-svg>
                      <icon-svg v-if="project.type === 9" name="db_oracle" class-name="card-button-icon"></icon-svg>
                  </div>
                  <div style="margin-top: 20px;margin-left: 50%"> 数据表： <font COLOR="#324ded">{{project.tableCount}}</font>个</div>
                  <div style="margin-top: 10px;margin-left: 50%">数据集： <font COLOR="#269f6f"> {{project.dataSetCount}}</font>个</div>
                </div>
              </div>
            </el-card>
            <el-card v-if="project.isConnect === 0" shadow="always" style="margin-left:10px;height:160px;border:3px solid #fa2357">
              <div style="height: 160px; ">
                <div>
                  <div>
                    <div style="height: 50px; text-align: left">
                      <font COLOR="#dd305d" size="5">{{project.name}}</font>
                    </div>
                  </div>
                  <div  >
                    <icon-svg v-if="project.type === 1" name="db_oracle" class-name="card-button-icon"></icon-svg>
                    <icon-svg v-if="project.type === 2" name="db_mssql" class-name="card-button-icon"></icon-svg>
                    <icon-svg v-if="project.type === 3" name="db_mysql" class-name="card-button-icon" ></icon-svg>
                    <icon-svg v-if="project.type === 4" name="db_db2" class-name="card-button-icon" ></icon-svg>
                    <icon-svg v-if="project.type === 5" name="db_dm" class-name="card-button-icon" ></icon-svg>
                    <icon-svg v-if="project.type === 6" name="db_gbase" class-name="card-button-icon"></icon-svg>
                    <icon-svg v-if="project.type === 7" name="db_postgresql" class-name="card-button-icon" ></icon-svg>
                    <icon-svg v-if="project.type === 8" name="db_sybase" class-name="card-button-icon"></icon-svg>
                    <icon-svg v-if="project.type === 9" name="db_oracle" class-name="card-button-icon"></icon-svg>
                  </div>
                  <div style="margin-top: 20px;margin-left: 50%">  数据表：<font COLOR="#dd305d">{{project.tableCount}}</font>个</div>
                  <div style="margin-top: 10px;margin-left: 50%">  数据集：<font COLOR="#ef9414">{{project.dataSetCount}}</font>个</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <div slot="header" class="card-head">
        <span>本月数据增量统计</span>
      </div>
      <div id="datasourceMonthChart" style="width: 100%;height: 400px" ></div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <div slot="header" class="card-head">
            <span>数据源数据增量对比统计</span>
          </div>
          <div id="ZLPie" style="height: 400px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header" class="card-head">
            <span>不同来源数据量统计</span>
          </div>
          <div id="LYPie" style="height: 400px;"></div>
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
        dataSourceList: [],
        dataSourceName: [],
        dataSourceZL: [],
        dataSourceZHL: [],
        dataSourcePieName: [],
        dataSourcePie: []
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
          url: this.$http.adornUrl('/home/queryDataSourceData'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.dataSourceList = data.result.dataSourceStatus
          for (var i = 0; i < data.result.dataSourceStatus.length; i++) {
            this.dataSourceName.push(data.result.dataSourceStatus[i].name)
            var exist = false
            for (var j = 0; j < data.result.sumRow.length; j++) {
              if (data.result.sumRow[j].data_source_name === data.result.dataSourceStatus[i].name) {
                this.dataSourceZL.push(data.result.sumRow[j].count)
                exist = true

                if (data.result.lastMonth.length > 0) {
                  for (var k = 0; k < data.result.lastMonth.length; k++) {
                    if ((data.result.lastMonth[k].data_source_name === data.result.sumRow[j].data_source_name)) {
                      this.dataSourceZHL.push(data.result.sumRow[j].count - data.result.lastMonth[k].count)
                    }
                  }
                } else {
                  this.dataSourceZHL.push(data.result.sumRow[j].count)
                }
              }
            }
            if (exist === false) {
              this.dataSourceZL.push(0)
              this.dataSourceZHL.push(0)
            }
          }

          var count = data.result.dataSourceStatus.length < 4 ? data.result.dataSourceStatus.length : 4
          for (i = 0; i < count; i++) {
            this.dataSourcePieName.push(data.result.dataSourceStatus[i].name)
            this.dataSourcePie.push({
              'name': data.result.dataSourceStatus[i].name,
              'value': this.dataSourceZHL[i]
            })
          }
          this.dataSourcePieName.push('其他')
          var otherCount = 0
          for (i = 4; i < data.result.dataSourceStatus.length; i++) {
            otherCount = otherCount + this.dataSourceZHL[i]
          }
          this.dataSourcePie.push({
            'name': '其他',
            'value': otherCount
          })
          this.showDataSourceBar()
          this.showDataSourceMonthBar()
          this.showZLPie()
          this.showLYPie()
        })
      },

      showDataSourceBar () {
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
              name: '数据源数据总量统计',
              type: 'bar',
              barWidth: '60%',
              data: this.dataSourceZL,
              label: {
                normal: {
                  show: true,
                  position: 'top',
                  formatter: function toThousands (params) {
                    console.log(params)
                    var result = []
                    var counter = 0
                    params.value = (params.value || 0).toString().split('')
                    for (var i = params.value.length - 1; i >= 0; i--) {
                      counter++
                      result.unshift(params.value[i])
                      if (!(counter % 3) && i !== 0) { result.unshift(',') }
                    }
                    return result.join('')
                  }

                }
              }
            }
          ]
        }

        bar.chartGraph = echarts.init(document.getElementById('datasourceSumChart'))
        bar.chartGraph.setOption(bar.option)
      },

      showDataSourceMonthBar () {
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
              name: '本月数据增量统计',
              type: 'bar',
              barWidth: '60%',
              data: this.dataSourceZHL
            }
          ]
        }

        bar.chartGraph = echarts.init(document.getElementById('datasourceMonthChart'))
        bar.chartGraph.setOption(bar.option)
      },

      showZLPie () {
        var pie = {}
        pie.option = {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: this.dataSourcePieName
          },
          color: ['#4da0e1', '#ffbb12', '#dc50ac', '#5fb29f', '#dc7057'],
          series: [
            {
              name: '数据源数据增量',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: this.dataSourcePie,
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

        pie.chartGraph = echarts.init(document.getElementById('ZLPie'))
        pie.chartGraph.setOption(pie.option)
      },

      showLYPie () {
        var pie = {}
        pie.option = {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['业务系统产生', '数据交换', '其他']
          },
          color: ['#4da0e1', '#ffbb12', '#dc50ac', '#5fb29f', '#dc7057'],
          series: [
            {
              name: '不同来源数据量统计',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                {value: 100000, name: '业务系统产生'},
                {value: 90000, name: '数据交换'},
                {value: 40000, name: '其他'}
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

        pie.chartGraph = echarts.init(document.getElementById('LYPie'))
        pie.chartGraph.setOption(pie.option)
      },

      dataSourceClick (id, type, name) {
        this.$router.push(
          {path: 'datasource',
            query: {
              id: id,
              type: type,
              name: name
            }})
      }
    }
  }
</script>

<style scoped>
  .el-card__header{
    padding: 12px 20px;
    background-color:#f5f5f5
  }
</style>
