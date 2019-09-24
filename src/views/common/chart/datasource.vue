<template>
  <div class="mod-home-echarts">
    <el-row stylt="width:100%">
        <div style="width: 25%; float: left">
          <el-card class="homepage-button-div" style="cursor: default">
            <div class="card-button-icon-wrapper" >
              <icon-svg v-if="this.dataSourceType == 1" name="db_oracle" class-name="card-button-icon"></icon-svg>
              <icon-svg v-if="this.dataSourceType == 2" name="db_mssql" class-name="card-button-icon"></icon-svg>
              <icon-svg v-if="this.dataSourceType == 3" name="db_mysql" class-name="card-button-icon" ></icon-svg>
              <icon-svg v-if="this.dataSourceType == 4" name="db_db2" class-name="card-button-icon" ></icon-svg>
              <icon-svg v-if="this.dataSourceType == 5" name="db_dm1" class-name="card-button-icon" ></icon-svg>
              <icon-svg v-if="this.dataSourceType == 6" name="db_gbase" class-name="card-button-icon"></icon-svg>
              <icon-svg v-if="this.dataSourceType == 7" name="db_postgresql" class-name="card-button-icon" ></icon-svg>
              <icon-svg v-if="this.dataSourceType == 8" name="db_sybase" class-name="card-button-icon"></icon-svg>
              <icon-svg v-if="this.dataSourceType == 9" name="db_oracle" class-name="card-button-icon"></icon-svg>
            </div>

            <div class="card-button-description" style="cursor: default">
              <div class="card-button-text-right">{{this.dataSourceName}}</div>
            </div>
          </el-card>
        </div>
        <div style="width: 25%; float: left;padding-left: 20px">
          <el-card class="homepage-button-div" style="cursor: default">
            <div class="card-button-icon-wrapper" >
              <icon-svg name="table_chroma(1)" class-name="card-button-icon icon-table"></icon-svg>
            </div>

            <div class="card-button-description" style="cursor: default">
              <div class="card-button-text-right">数据表</div>
              <count-to :start-val="0" :end-val="this.tableNum" :duration="2000" class="card-panel-num"/>张
            </div>
          </el-card>
        </div>
        <div style="width: 25%; float: left;padding-left: 20px">
        <el-card class="homepage-button-div" style="cursor: default">
          <div class="card-button-icon-wrapper" >
            <icon-svg name="dataset_chroma(1)" class-name="card-button-icon icon-dataset"></icon-svg>
          </div>
          <div class="card-button-description" style="cursor: default">
            <div class="card-button-text-right">数据集</div>
            <count-to :start-val="0" :end-val="this.datasetNum" :duration="2000" class="card-panel-num"/>个
          </div>
        </el-card>
      </div>


        <div style="width: 25%; float: left;padding-left: 20px">
        <el-card class="homepage-button-div" style="cursor: default">
          <div class="card-button-icon-wrapper" @click="dataServiceChartHandle()">
            <icon-svg name="infofetch" class-name="card-button-icon icon-table"></icon-svg>
          </div>

          <div class="card-button-description" style="cursor: default">
            <div class="card-button-text-right">数据服务</div>
            <count-to :start-val="0" :end-val="this.SerNum" :duration="2000" class="card-panel-num"/>个
          </div>
        </el-card>
      </div>

    </el-row>

    <el-card class="box-card" style="margin-top: 30px">
      <div slot="header" class="card-head">
        <span>各表数据量统计</span>
      </div>
      <div id="tableBar" style="width: 100%;height: 400px" ></div>
    </el-card>

    <el-card class="box-card" style="margin-top: 20px">
      <div slot="header" class="card-head">
        <span>各表数据项统计</span>
      </div>
      <div id="tableDataBar" style="width: 100%;height: 400px" ></div>
    </el-card>

    <el-card class="box-card" style="margin-top: 20px">
      <div slot="header" class="card-head">
        <span>数据集中数据项统计</span>
      </div>
      <div id="dataSetBar" style="width: 100%;height: 400px" ></div>
    </el-card>

    <el-card class="box-card" style="margin-top: 20px">
      <div slot="header" class="card-head">
        <span>数据集中数据量统计</span>
      </div>
      <div id="dataSetRowBar" style="width: 100%;height: 400px" ></div>
    </el-card>


  </div>
</template>

<script>
  import countTo from 'vue-count-to'
  import echarts from 'echarts'
  // 'echarts/dist/echarts.min'

  export default {
    components: {
      countTo
    },
    data () {
      return {
        dataSourceId: '',
        dataSourceType: 0,
        dataSourceName: '',
        SerNum: 0,
        dataSourceNum: 0,
        datasetNum: 0,
        tableNum: 0,
        tableCountList: [],
        tableNameList: [],
        tableColumnList: [],
        dataSetNameList: [],
        bssColumnList: [],
        tableRowNameList: [],
        tableRowCountList: [],
        dataSetRowNameList: [],
        dataSetRowCountList: []
      }
    },
    mounted () {
      console.log('mounted()')
      this.getParams()
    },
   /* created () {
   /!*   console.log('created()')
      this.getParams()*!/
    }, */
    watch: {
      '$route': 'getParams'
    },
    activated () {
      console.log('activated()')
      this.getParams()
      this.initDataChart()
    },
    methods: {
      getParams () {
        this.dataSourceId = this.$route.query.id
        this.dataSourceType = this.$route.query.type
        this.dataSourceName = this.$route.query.name
      },
      // 初始化querydata
      initDataChart () {
        this.tableCountList = []
        this.tableNameList = []
        this.tableColumnList = []
        this.dataSetNameList = []
        this.bssColumnList = []
        this.tableRowNameList = []
        this.tableRowCountList = []
        this.dataSetRowNameList = []
        this.dataSetRowCountList = []
        this.dataSetRowNameList = []
        this.dataSetRowCountList = []
        this.$http({
          url: this.$http.adornUrl(`/home/queryByDataSource/${this.dataSourceId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.SerNum = data.result.serviceCount
          this.datasetNum = data.result.dataSetCount
          this.tableNum = data.result.tableCount
          this.tableColumnList = data.result.tableColumnList
          this.bssColumnList = data.result.bssColumnList

          for (var i = 0; i < data.result.tableList.length; i++) {
            this.tableNameList.push(data.result.tableList[i].table_name === '' ? data.result.tableList[i].table_code : data.result.tableList[i].table_name)
          }

          for (i = 0; i < data.result.tableRowList.length; i++) {
            this.tableRowNameList.push(data.result.tableRowList[i].table_name)
            this.tableRowCountList.push(data.result.tableRowList[i].value)
          }

          for (i = 0; i < data.result.dataSetList.length; i++) {
            this.dataSetNameList.push(data.result.dataSetList[i].business_name)
          }

          for (i = 0; i < data.result.dataSetRowList.length; i++) {
            this.dataSetRowNameList.push(data.result.dataSetRowList[i].bss_name)
            this.dataSetRowCountList.push(data.result.dataSetRowList[i].value)
          }
        }).then(() => {
          this.showTableBar()
          this.showTableDataBar()
          this.showDataSetBar()
          this.showDataSetRowBar()
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
          dataZoom: [{
            type: 'inside'
          }, {
            type: 'slider'
          }],
          color: ['#4da0e1'],
          yAxis: {
            type: 'value'
          },
          xAxis: [{
            axisLabel: {
              rotate: 25
            },
            type: 'category',
            data: this.tableRowNameList
          }],
          series: [
            {
              name: '数据表中数据量',
              type: 'bar',
              barWidth: '60%',
              data: this.tableRowCountList

            }
          ]
        }

        bar.chartGraph = echarts.init(document.getElementById('tableBar'))
        bar.chartGraph.setOption(bar.option)
      },

      showTableDataBar () {
        var bar = {}
        bar.option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          dataZoom: [{
            type: 'inside'
          }, {
            type: 'slider'
          }],
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
            data: this.tableNameList
          }],
          series: [
            {
              name: '数据表中数据项',
              type: 'bar',
              barWidth: '60%',
              data: this.tableColumnList

            }
          ]
        }

        bar.chartGraph = echarts.init(document.getElementById('tableDataBar'))
        bar.chartGraph.setOption(bar.option)
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
          dataZoom: [{
            type: 'inside'
          }, {
            type: 'slider'
          }],
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
            data: this.dataSetNameList
          }],
          series: [
            {
              name: '数据集中数据项',
              type: 'bar',
              barWidth: '60%',
              data: this.bssColumnList
            }
          ]
        }

        bar.chartGraph = echarts.init(document.getElementById('dataSetBar'))
        bar.chartGraph.setOption(bar.option)
      },

      showDataSetRowBar () {
        var bar = {}
        bar.option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          dataZoom: [{
            type: 'inside'
          }, {
            type: 'slider'
          }],
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
            data: this.dataSetRowNameList
          }],
          series: [
            {
              name: '数据集中数据数据量',
              type: 'bar',
              barWidth: '60%',
              data: this.dataSetRowCountList
            }
          ]
        }

        bar.chartGraph = echarts.init(document.getElementById('dataSetRowBar'))
        bar.chartGraph.setOption(bar.option)
      }

    }
  }
</script>

<style>
  .mod-home {
    line-height: 1.5;
  }
</style>
<style lang="scss">
  .el-card__header{
    font-weight:bold;
    font-size:16px;
    padding: 12px 20px;
    background-color:#f0f2f5
  }
  .homepage-button-div {
    vertical-align: middle;
    height: 120px;
    cursor: pointer;
    //position: relative;
    overflow: hidden;
    color: #666;
    background: #f0f2f5;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
  }

  .mod-home-echarts {
    > .el-alert {
      margin-bottom: 10px;
    }
    > .el-row {
      margin-top: -10px;
      margin-bottom: -10px;
      .el-col {
        padding-top: 10px;
        padding-bottom: 10px;
      }
    }
    .chart-box {
      min-height: 380px;
    }
    .card-button-icon {

      float: left;
      vertical-align: middle;
      font-size: 80px;
      border-radius: 6px;
      padding: 7px;

    }
    .card-button-icon-wrapper {

      float: left;
      /*padding: 2px;*/
      transition: all 0.38s ease-out;
    /*  &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }
        .icon-datasource {
          background: #40c9c6;
          color: #fff;
        }
        .icon-table {
          background: #36a3f7;
          color: #fff;
        }
        .icon-dir {
          background: #f4516c;
          color: #fff;
        }
        .icon-dataset {
          background: #34bfa3;
          color: #fff;
        }
      }*/
      .icon-datasource {
        color: #40c9c6;
      }
      .icon-table {
        color: #36a3f7;
      }
      .icon-dir {
        color: #f4516c;
      }
      .icon-dataset {
        color: #34bfa3
      }

    }
    .card-button-description {
      float: right;
      font-weight: bold;
      margin: 8px 12px 0px 0px;
      vertical-align: middle;
      padding: 10px;
      border-radius: 6px;
      .card-button-text-right {
        font-weight: bold;
        line-height: 20px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 22px;
        margin-top: 0px;
        margin-bottom: 12px;
      }
      /*&:hover {
        background-color: #dddddd;
        color: #999999;
      }*/
    }
    .card-button-text {
      float: left;
      vertical-align: middle;
      font-weight: bold;
      line-height: 22px;
      margin-left: 5px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 20px;
    }
    .select-float {
      width: 100px;
      height: 10px;
      float: right;
    }

    .card-panel-num {
      font-size: 20px;
    }

    /*.icon-datasource{
      color: #40C9C6;
    }
    &:hover {
      .icon-datasource{
        background: #40C9C6;
      }
    }*/
  }
</style>


