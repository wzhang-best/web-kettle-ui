<template>
  <div class="">
    <el-form ref="filterRows" :model="filterRows" label-width="140px">
      <el-form-item label="步骤名称" prop="name">
        <el-input v-model="filterRows.name"></el-input>
      </el-form-item>
      <el-form-item label="发送true数据给步骤" prop="send_true_to">
        <el-select v-model="filterRows.send_true_to" placeholder="请选择" style="width:100%;">
          <el-option
            v-for="item in stepsoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发送true数据给步骤" prop="send_false_to">
        <el-select v-model="filterRows.send_false_to" placeholder="请选择" style="width:100%;">
          <el-option
            v-for="item in stepsoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设置条件">
        <el-input v-model="negated" style="width:20%"></el-input> <el-input v-model="leftvalue" style="width:20%"></el-input> <el-input v-model="fun" style="width:20%"></el-input> <el-input v-model="rightvalue" style="width:20%"></el-input> <el-button type="primary" @click="addCondition">添加</el-button>
      </el-form-item>
      <el-form-item label="条件结果列表" prop="conditions">
        <el-table :data="filterRows.conditions" border style="width: 100%;" height="150">
            <el-table-column  type="selection"></el-table-column>
            <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="removeconditions(scope.$index)"
                    size="mini">删除
                  </el-button>
                </template>
            </el-table-column >
            <el-table-column property="method" label="条件"></el-table-column>
            <el-table-column property="source_value" label="值"></el-table-column>
          </el-table>
      </el-form-item>
    </el-form>
    <div class="el-dialog__footer">
      <span  class="dialog-footer">
        <el-button type="primary" @click="handleSaveData">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </span>
    </div>
  </div>
</template>

<script>
/* eslint semi: ["error", "always"] */
export default {
  name: 'filterRows',
  props: {
    name: String
  },
  data () {
    return {
      negated: 'NOT',
      leftvalue: '',
      fun: '=',
      rightvalue: '',
      filterRows: {
        name: '过滤记录',
        conditions: [{method: 'AND', source_value: 'A=B'}]
      },
      temp: {
        name: '过滤记录',
        conditions: []
      },
      stepsoptions: [{
        value: 'CRC32',
        label: 'CRC32'
      }, {
        value: 'MD5',
        label: 'MD5'
      }]
    };
  },
  methods: {
    loadData (data) {
      if (data) {
        this.$forceUpdate();
        this.filterRows = Object.assign({}, data);
      }
    },
    // 保存表单数据
    handleSaveData () {
      this.$emit('savePluginData', this.filterRows);
      this.filterRows = Object.assign({}, this.temp);
    },
    cancel () {
      this.$emit('cancel');
      this.filterRows = Object.assign({}, this.temp);
    },
    setGraph (val) {
      this.graph = val;
    },
    // 重置表单数据
    resetFormData (stepname) {
      this.$forceUpdate();
      this.$refs['filterRows'].resetFields();
      this.filterRows.name = stepname;
    },
    addCondition () {
    },
    removeconditions () {
      this.filterRows.conditions.push({});
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.el-form-item {
  margin-bottom: 10px !important;
}
.u-el-input {
  // width: 490px;
}
</style>
