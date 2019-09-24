/**
 显示输入输出字段弹框
 */
<template>
  <div>
    步骤名称：<span>{{stepName}}</span><br>
    字段:
    <el-table
      :data="fields.data"
      stripe
      border
      tooltip-effect="dark"
      style="100%">
      <el-table-column
        fixed
        type="index"
        width="50"
        header-align="center"
        align="center"></el-table-column>
      <template v-for="(column, index) in fields.columns">
        <el-table-column
          :prop="column.prop"
          :label="column.label"
          :key="index"
          :width="column.width"
          show-overflow-tooltip>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
/* eslint semi: ["error", "always"] */
// @ is an alias to /src
export default {
  name: 'Showfields',
  props: {
  },
  data () {
    return {
      fields: {
        columns: [
          { type: 'normal', prop: 'name', label: '字段名称', width: 80 },
          { type: 'normal', prop: 'type', label: '类型', width: 80 },
          { type: 'normal', prop: 'length', label: '长度', width: 80 },
          { type: 'normal', prop: 'precision', label: '精度', width: 80 },
          { type: 'normal', prop: 'origin', label: '步骤来源', width: 80 },
          { type: 'normal', prop: 'storage_type', label: '存储', width: 80 },
          { type: 'normal', prop: 'conversion_mask', label: '掩码', width: 80 },
          { type: 'normal', prop: 'currency_symbol', label: 'Currency', width: 90 },
          { type: 'normal', prop: 'decimal_symbol', label: '十进制', width: 80 },
          { type: 'normal', prop: 'grouping_symbol', label: '组', width: 80 },
          { type: 'normal', prop: 'trim_type', label: '去除空字符', width: 100 },
          { type: 'normal', prop: 'comments', label: '注释', width: 80 }
        ],
        data: []
      },
      stepName: ''
    };
  },
  methods: {
    // 加载列表数据
    listFields (data) {
      this.fields.data = data;
    },
    // 显示步骤名称
    showStepName (stepName) {
      this.stepName = stepName;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
