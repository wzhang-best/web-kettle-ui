<template>
  <div class="mod-home-echarts">
    <el-row stylt="width:100%">
      <div class="area right-space">
        <el-card class="homepage-button-div">
          <el-tooltip content="查看数据源统计" placement="top" >
            <div class="card-button-icon-wrapper" @click="datasourceChartHandle()">
              <icon-svg name="datasource_count" class-name="card-button-icon icon-datasource"></icon-svg>
            </div>
          </el-tooltip>


          <el-tooltip content="查看数据源信息" placement="top" >
          <div class="card-button-description" @click="datasourceHandle()">
            <div class="card-button-text-right">数据源</div>
            <count-to :start-val="0" :end-val="this.dataSourceNum" :duration="2000" class="card-panel-num"/>
            个
          </div>
          </el-tooltip>
        </el-card>
      </div>
      <div class="area right-space">
        <el-card class="homepage-button-div">
          <el-tooltip content="查看数据表统计" placement="top">
            <div class="card-button-icon-wrapper" @click="tableChartHandle()">
              <icon-svg name="table_chroma(1)" class-name="card-button-icon icon-table"></icon-svg>
            </div>
          </el-tooltip>

          <el-tooltip content="查看数据表信息" placement="top" >
          <div class="card-button-description" @click="tableHandle()">
            <div class="card-button-text-right">数据表</div>
            <count-to :start-val="0" :end-val="this.tableNum" :duration="2000" class="card-panel-num"/>
            张
          </div>
          </el-tooltip>
        </el-card>
      </div>
      <div class="area right-space">
        <el-card class="homepage-button-div">
          <el-tooltip content="查看数据集统计" placement="top">
            <div class="card-button-icon-wrapper"  @click="datasetChartHandle()">
              <icon-svg name="dataset_chroma(1)" class-name="card-button-icon icon-dataset"></icon-svg>
            </div>
          </el-tooltip>

          <el-tooltip content="查看数据集信息" placement="top" >
          <div class="card-button-description" @click="datasetHandle()">
            <div class="card-button-text-right">数据集</div>
            <count-to :start-val="0" :end-val="this.datasetNum" :duration="2000" class="card-panel-num"/>
            个
          </div>
          </el-tooltip>
        </el-card>
      </div>
      <div class="area right-space">
        <el-card class="homepage-button-div">
          <el-tooltip content="查看数据服务统计" placement="top">
            <div class="card-button-icon-wrapper"  @click="dataServiceChartHandle()">
              <icon-svg name="infofetch" class-name="card-button-icon icon-table"></icon-svg>
            </div>
          </el-tooltip>

          <el-tooltip content="查看数据服务信息" placement="top" >
          <div class="card-button-description" @click="dataServiceHandle()">
            <div class="card-button-text-right">数据服务</div>
            <count-to :start-val="0" :end-val="this.SerNum" :duration="2000" class="card-panel-num"/>
            个
          </div>
          </el-tooltip>
        </el-card>
      </div>
      <div class="area">
        <el-card class="homepage-button-div">
          <el-tooltip content="查看目录统计" placement="top">
            <div class="card-button-icon-wrapper"  @click="categoryChartHandle()">
              <icon-svg name="dir_count" class-name="card-button-icon icon-dir"></icon-svg>
            </div>
          </el-tooltip>

          <el-tooltip content="查看目录信息" placement="top" >
          <div class="card-button-description" @click="dirHandle()">
            <div class="card-button-text-right">目录</div>
            <count-to :start-val="0" :end-val="this.categoryCount" :duration="2000" class="card-panel-num"/>
            大类
            <count-to :start-val="0" :end-val="this.dirNum" :duration="2000" class="card-panel-num"/>
            个
          </div>
          </el-tooltip>
        </el-card>
      </div>
    </el-row>
    <el-row :gutter="20" v-if="datasourceChartVisible">
      <el-col :span="24">
        <div>
          <datasource-chart></datasource-chart>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" v-if="tableChartVisible">
      <el-col :span="24">
        <div>
          <table-chart></table-chart>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" v-if="categoryChartVisible">
      <el-col :span="24">
        <div>
          <category-chart></category-chart>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" v-if="datasetChartVisible">
      <el-col :span="24">
        <div>
          <dataset-chart></dataset-chart>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" v-if="dataServiceChartVisible">
      <el-col :span="24">
        <div>
          <data-service-chart></data-service-chart>
        </div>
      </el-col>
    </el-row>


  </div>
</template>

<script>
  import countTo from 'vue-count-to'

  import datasourceChart from './component/datasourceChart'
  import tableChart from './component/tableChart'
  import categoryChart from './component/categoryChart'
  import datasetChart from './component/datasetChart'
  import dataServiceChart from './component/dataServiceChart'

  export default {
    components: {
      countTo,
      datasourceChart,
      tableChart,
      categoryChart,
      dataServiceChart,
      datasetChart
    },
    data () {
      return {
        datasourceVisible: false,
        tableVisible: false,
        datasetVisible: false,
        dataServiceVisible: false,
        dirVisible: false,
        tableChartVisible: false,
        categoryChartVisible: false,
        datasetChartVisible: false,
        dataServiceChartVisible: false,
        datasourceChartVisible: false,
        SerNum: 0,
        dataSourceNum: 0,
        datasetNum: 0,
        categoryCount: 0,
        dirNum: 0,
        tableNum: 0
      }
    },
    mounted () {
      this.initDataChart()
    },
    activated () {
    },
    methods: {
      // 初始化querydata
      initDataChart () {
        this.$http({
          url: this.$http.adornUrl('/home/queryData'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.SerNum = data.resultBean.dataServiceCount
          this.dataSourceNum = data.resultBean.dataSourceCount
          this.datasetNum = data.resultBean.dataSetCount
          this.dirNum = data.resultBean.dirCount
          this.categoryCount = data.resultBean.categoryCount
          this.tableNum = data.resultBean.tableCount
        }).then(() => {
          this.datasourceChartHandle()
        })
      },
      // 跳转页面
      datasourceHandle () {
        this.datasourceVisible = true
        this.$router.push({name: 'src-datasource'})
      },
      dataServiceHandle () {
        this.dataServiceVisible = true
        this.$router.push({name: 'ser-service'})
      },
      tableHandle () {
        this.tableVisible = true
        this.$router.push({name: 'src-table'})
      },
      dirHandle () {
        this.dirVisible = true
        this.$router.push({name: 'bss-dataset'})
      },
      datasetHandle () {
        this.datasetVisible = true
        this.$router.push({name: 'bss-dataset'})
      },
      dataServiceChartHandle () {
        this.dataServiceChartVisible = true
        this.tableChartVisible = false
        this.categoryChartVisible = false
        this.datasetChartVisible = false
        this.datasourceChartVisible = false
      },
      // 切换图表
      datasourceChartHandle () {
        this.dataServiceChartVisible = false
        this.tableChartVisible = false
        this.categoryChartVisible = false
        this.datasetChartVisible = false
        this.datasourceChartVisible = true
      },
      tableChartHandle () {
        this.datasourceChartVisible = false
        this.tableChartVisible = true
        this.categoryChartVisible = false
        this.datasetChartVisible = false
        this.dataServiceChartVisible = false
      },
      categoryChartHandle () {
        this.datasourceChartVisible = false
        this.tableChartVisible = false
        this.categoryChartVisible = true
        this.datasetChartVisible = false
        this.dataServiceChartVisible = false
      },
      datasetChartHandle () {
        this.datasourceChartVisible = false
        this.tableChartVisible = false
        this.categoryChartVisible = false
        this.datasetChartVisible = true
        this.dataServiceChartVisible = false
      }
    }
  }
</script>

<style   lang="scss">
  .area {
    width: calc(20% - 12px);
    float: left;
    min-width: 260px;
    padding-bottom: 5px;
  }

  .right-space {
    margin-right: 15px;
  }

  .mod-home {
    line-height: 1.5;
  }

  .el-card__header {
    font-weight: bold;
    font-size: 16px;
    padding: 12px 20px;
    background-color: #f0f2f5
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
      &:hover {
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
      }
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
      margin: 8px 0px 0px 0px;
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
      &:hover {
        background-color: #dddddd;
        color: #999999;
      }
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


